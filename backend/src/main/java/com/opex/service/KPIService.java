package com.opex.service;

import com.opex.model.KPI;
import com.opex.repository.KPIRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
public class KPIService {

    @Autowired
    private KPIRepository kpiRepository;

    public List<KPI> findAll() {
        return kpiRepository.findAllByOrderByMonthDesc();
    }

    public List<KPI> findBySite(String site) {
        return kpiRepository.findBySiteOrderByMonthDesc(site);
    }

    public Optional<KPI> findByMonthAndSite(YearMonth month, String site) {
        return kpiRepository.findByMonthAndSite(month, site);
    }

    public KPI save(KPI kpi) {
        kpi.setUpdatedAt(LocalDateTime.now());
        return kpiRepository.save(kpi);
    }

    public Double getTotalCostSavings() {
        Double total = kpiRepository.getTotalCostSavings();
        return total != null ? total : 0.0;
    }

    public Double getAverageProductivityGain() {
        Double avg = kpiRepository.getAverageProductivityGain();
        return avg != null ? avg : 0.0;
    }

    public Optional<KPI> findById(Long id) {
        return kpiRepository.findById(id);
    }

    public void delete(Long id) {
        kpiRepository.deleteById(id);
    }
}