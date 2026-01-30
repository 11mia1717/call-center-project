package com.gwangjin.issuerwas.config;

import com.gwangjin.issuerwas.common.security.ServiceTokenInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final ServiceTokenInterceptor serviceTokenInterceptor;

    @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins:http://localhost:5174}")
    private String[] allowedOrigins;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(serviceTokenInterceptor)
                .addPathPatterns("/issuer/**");
    }

    @Override
    public void addCorsMappings(@org.springframework.lang.NonNull org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
        if (allowedOrigins != null) {
            registry.addMapping("/**")
                    .allowedOrigins(allowedOrigins)
                    .allowedMethods("*")
                    .allowedHeaders("*");
        }
    }
}
