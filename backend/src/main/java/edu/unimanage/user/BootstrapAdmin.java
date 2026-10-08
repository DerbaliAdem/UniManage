package edu.unimanage.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class BootstrapAdmin {
    @Bean
    ApplicationRunner createBootstrapAdmin(
            UserAccountRepository users,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap.admin-email:}") String email,
            @Value("${app.bootstrap.admin-password:}") String password,
            @Value("${app.bootstrap.admin-name}") String name) {
        return args -> {
            if (email.isBlank() && password.isBlank()) return;
            if (email.isBlank() || password.isBlank()) {
                throw new IllegalStateException("Set both APP_BOOTSTRAP_ADMIN_EMAIL and APP_BOOTSTRAP_ADMIN_PASSWORD, or leave both empty");
            }
            if (password.length() < 12) {
                throw new IllegalStateException("The bootstrap administrator password must be at least 12 characters");
            }
            if (!users.existsByEmailIgnoreCase(email)) {
                users.save(new UserAccount(email, passwordEncoder.encode(password), name, UserRole.ADMIN));
            }
        };
    }
}
