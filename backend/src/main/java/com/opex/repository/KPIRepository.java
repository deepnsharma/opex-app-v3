package com.opex.repository;

import com.opex.model.KPI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface KPIRepository extends JpaRepository<KPI, Long> {
    List<KPI> findBySiteOrderByMonthDesc(String site);
    Optional<KPI> findByMonthAndSite(YearMonth month, String site);
    List<KPI> findAllByOrderByMonthDesc();
    
    @Query("SELECT SUM(k.costSavings) FROM KPI k")
    Double getTotalCostSavings();
    
    @Query("SELECT AVG(k.productivityGain) FROM KPI k")
    Double getAverageProductivityGain();
}