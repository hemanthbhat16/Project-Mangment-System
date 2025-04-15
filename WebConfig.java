package com.example.project_management.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig {
//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(CorsRegistry registry) {
//                 registry.addMapping("/**") // Allow all endpoints
//                         .allowedOrigins("http://localhost:3000")
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow GET, POST, PUT, DELETE, etc.
//                         .allowedHeaders("*")
//                         .allowCredentials(true);
//             }
//         };
//     }
// }


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")  // Adjust this to your frontend's URL
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Specify allowed HTTP methods
                        .allowedHeaders("*")  // Allow all headers
                        .allowCredentials(true);  // Allow cookies/credentials to be sent
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
               registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
        };
    }
}
