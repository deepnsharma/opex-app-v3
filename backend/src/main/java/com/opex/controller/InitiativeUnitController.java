package com.opex.controller;

import com.opex.model.InitiativeUnit;
import com.opex.service.InitiativeUnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/initiative-units")
public class InitiativeUnitController {

    @Autowired
    private InitiativeUnitService service;

    @GetMapping
    public List<InitiativeUnit> getAllUnits() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InitiativeUnit> getUnitById(@PathVariable Long id) {
        Optional<InitiativeUnit> unit = service.findById(id);
        return unit.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<InitiativeUnit> getUnitByCode(@PathVariable String code) {
        Optional<InitiativeUnit> unit = service.findByCode(code);
        return unit.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}