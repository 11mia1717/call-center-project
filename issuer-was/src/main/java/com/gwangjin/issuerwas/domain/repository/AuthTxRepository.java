package com.gwangjin.issuerwas.domain.repository;

import com.gwangjin.issuerwas.domain.entity.AuthTx;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AuthTxRepository extends JpaRepository<AuthTx, UUID> {
}
