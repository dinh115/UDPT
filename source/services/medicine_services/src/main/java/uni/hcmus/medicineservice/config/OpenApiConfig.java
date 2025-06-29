package uni.hcmus.medicineservice.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port}")
    private String serverPort;
    
    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Medicine Service API Documentation")
                        .description("RESTful API documentation for the Medicine Service application.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("HCMUS Medicine Team")
                                .email("contact@example.com")
                                .url("https://github.com/HCMUS/medicine-service"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort + contextPath)
                                .description("Development Server")
                ))
                .components(new Components().addSecuritySchemes("api", new SecurityScheme().scheme("bearer").type(SecurityScheme.Type.HTTP).bearerFormat("JWT")
                        .name("Authorization").description("Use 'Bearer {token}' format for authorization.")));
    }
}