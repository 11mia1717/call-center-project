package com.gwangjin.callcenterwas.config;

import com.gwangjin.callcenterwas.common.security.OperatorTokenInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final OperatorTokenInterceptor operatorTokenInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(operatorTokenInterceptor)
                .addPathPatterns("/callcenter/**")
                .excludePathPatterns("/callcenter/operator/login");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // callcenter-web
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
