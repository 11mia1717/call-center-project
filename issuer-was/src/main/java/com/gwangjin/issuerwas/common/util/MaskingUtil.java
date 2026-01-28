package com.gwangjin.issuerwas.common.util;

public class MaskingUtil {

    public static String maskName(String name) {
        if (name == null || name.length() < 2) return name;
        if (name.length() == 2) {
            return name.charAt(0) + "*";
        }
        StringBuilder sb = new StringBuilder();
        sb.append(name.charAt(0));
        for (int i = 1; i < name.length() - 1; i++) {
            sb.append("*");
        }
        sb.append(name.charAt(name.length() - 1));
        return sb.toString();
    }

    public static String maskPhone(String phone) {
        // 010-1234-5678 -> 010****5678
        if (phone == null || phone.length() < 10) return phone;
        String clearPhone = phone.replaceAll("-", "");
        if (clearPhone.length() == 11) {
             return clearPhone.substring(0, 3) + "****" + clearPhone.substring(7);
        }
        return phone; // Fallback
    }

    public static String maskCardNo(String cardNo) {
        // 1234-5678-1234-5678 -> 1234-****-****-5678
        if (cardNo == null || cardNo.length() < 16) return cardNo;
        String[] parts = cardNo.split("-");
        if (parts.length == 4) {
            return parts[0] + "-****-****-" + parts[3];
        }
        return cardNo; // Fallback
    }
}
