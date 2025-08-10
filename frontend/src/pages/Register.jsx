import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { lookupAPI } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select.jsx";
import { Alert, AlertDescription } from "../components/ui/alert.jsx";
import { useToast } from "../hooks/use-toast.jsx";

const roleOptions = [
  { code: "STLD", name: "Site TSD Lead" },
  { code: "SH", name: "Site Head" },
  { code: "EH", name: "Engg Head" },
  { code: "IL", name: "Initiative Lead" },
  { code: "CTSD", name: "Corp TSD" },
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    siteId: "",
    roleCode: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadSites = async () => {
      try {
        const res = await lookupAPI.getSites();
        setSites(res.data || []);
      } catch (e) {
        console.error("Failed to load sites", e);
        setError("Failed to load sites. Please refresh.");
      }
    };
    loadSites();
  }, []);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    if (!form.email.endsWith("@godeepak.com")) {
      setError("Only @godeepak.com emails are allowed");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!form.siteId || !form.roleCode) {
      setError("Please select Site and Role");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      siteId: parseInt(form.siteId),
      roleCode: form.roleCode,
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      toast({ title: "Registration successful", description: "Please login to continue" });
      navigate("/login");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="bg-white/70 backdrop-blur-lg border border-white/50 shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-slate-800 text-center">Create your OpEx account</CardTitle>
            <p className="text-center text-slate-600 text-sm">Use your @godeepak.com email to register</p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required className="h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email (@godeepak.com)</Label>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className="h-11" placeholder="name@godeepak.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site</Label>
                  <Select onValueChange={(v) => update("siteId", v)}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select site" /></SelectTrigger>
                    <SelectContent>
                      {sites.map((s) => (
                        <SelectItem key={s.id} value={s.id?.toString?.() ?? String(s.id)}>
                          {(s.code || s.siteCode) + (s.name ? ` - ${s.name}` : "")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select onValueChange={(v) => update("roleCode", v)}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((r) => (
                        <SelectItem key={r.code} value={r.code}>{r.code} - {r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required className="h-11" />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">{loading ? "Registering..." : "Create Account"}</Button>

              <p className="text-center text-sm text-slate-600">Already have an account? <Link className="text-blue-600 hover:underline" to="/login">Sign in</Link></p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;