package com.gwangjin.issuerwas.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "cards")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Card {

    @Id
    @Column(name = "card_ref")
    private UUID cardRef;

    @Column(name = "customer_ref")
    private UUID customerRef;

    @Column(name = "card_no")
    private String cardNo;

    @Column(name = "status")
    private String status; // ACTIVE, LOST, STOPPED

    public Card(UUID cardRef, UUID customerRef, String cardNo, String status) {
        this.cardRef = cardRef;
        this.customerRef = customerRef;
        this.cardNo = cardNo;
        this.status = status;
    }

    public void markAsLost() {
        this.status = "LOST";
    }
}
