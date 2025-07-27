package com.opex.repository;

import com.opex.model.InitiativeUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InitiativeUnitRepository extends JpaRepository<InitiativeUnit, Long> {
    Optional<InitiativeUnit> findByCode(String code);
}