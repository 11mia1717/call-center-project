package com.gwangjin.callcenterwas.config;

import com.gwangjin.callcenterwas.common.security.OperatorTokenInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final OperatorTokenInterceptor operatorTokenInterceptor;

    @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String[] allowedOrigins;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(operatorTokenInterceptor)
                .addPathPatterns("/callcenter/**")
                .excludePathPatterns("/callcenter/operator/login");
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        if (allowedOrigins != null) {
            registry.addMapping("/**")
                    .allowedOrigins(allowedOrigins) // callcenter-web
                    .allowedMethods("*")
                    .allowedHeaders("*");
        }
    }
}
