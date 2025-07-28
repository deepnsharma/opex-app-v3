package com.opex.repository;

import com.opex.model.Initiative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InitiativeRepository extends JpaRepository<Initiative, Long> {
    Optional<Initiative> findByInitiativeId(String initiativeId);
    List<Initiative> findBySite(String site);
    List<Initiative> findByStatus(String status);
    
    @Query("SELECT i FROM Initiative i WHERE i.unit.code = ?1")
    List<Initiative> findByUnitCode(String unitCode);
    
    @Query("SELECT COUNT(i) FROM Initiative i WHERE i.status = ?1")
    Long countByStatus(String status);
    
    @Query("SELECT SUM(i.estimatedSavings) FROM Initiative i WHERE i.status = 'APPROVED'")
    Double getTotalExpectedValue();
    
    @Query("SELECT COUNT(i) FROM Initiative i WHERE i.unit.code = ?1 AND i.discipline.code = ?2 AND YEAR(i.proposalDate) = ?3")
    Long countByUnitCodeAndDisciplineCodeAndYear(String unitCode, String disciplineCode, int year);
 
    @Query("SELECT COUNT(i) FROM Initiative i WHERE i.unit.code = ?1 AND YEAR(i.proposalDate) = ?2")
    Long countByUnitCodeAndYear(String unitCode, int year);
}