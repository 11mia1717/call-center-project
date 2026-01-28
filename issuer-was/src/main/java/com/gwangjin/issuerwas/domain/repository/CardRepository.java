package com.gwangjin.issuerwas.domain.repository;

import com.gwangjin.issuerwas.domain.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, UUID> {
    List<Card> findByCustomerRef(UUID customerRef);
}
