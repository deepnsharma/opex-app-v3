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
    List<Initiative> findByUserId(Long userId);
    
    @Query("SELECT COUNT(i) FROM Initiative i WHERE i.status = ?1")
    Long countByStatus(String status);
    
    @Query("SELECT SUM(i.expectedValue) FROM Initiative i WHERE i.status = 'Approved'")
    Double getTotalExpectedValue();
}