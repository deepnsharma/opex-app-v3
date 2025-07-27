package com.opex.service;

import com.opex.model.InitiativeUnit;
import com.opex.repository.InitiativeUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InitiativeUnitService {

    @Autowired
    private InitiativeUnitRepository repository;

    public List<InitiativeUnit> findAll() {
        return repository.findAll();
    }

    public Optional<InitiativeUnit> findById(Long id) {
        return repository.findById(id);
    }

    public Optional<InitiativeUnit> findByCode(String code) {
        return repository.findByCode(code);
    }

    public InitiativeUnit save(InitiativeUnit unit) {
        return repository.save(unit);
    }
}