package mk.ukim.finki.vinylvault;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "jwt.secret=VnlueWxWYXVsdFRlc3RTZWNyZXRLZXlUaGF0SXNMb25nRW5vdWdoRm9ySFMyNTZBdXRoVGVzdA=="
})
class VinylVaultApplicationTests {

    @Test
    void contextLoads() {
    }
}
