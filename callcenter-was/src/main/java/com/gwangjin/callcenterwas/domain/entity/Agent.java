package com.gwangjin.callcenterwas.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "agents")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agent {

    @Id
    private String agentId;

    private String password;
    
    private String name;
    
    private String role; // e.g., "AGENT", "ADMIN"
}
