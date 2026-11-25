package demo.desk;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import java.time.LocalDate;
@SpringBootApplication
public class DeskApplication {
 public static void main(String[] args) { SpringApplication.run(DeskApplication.class,args); }
 @Bean CommandLineRunner seed(DeskRepository repo) {
  return args -> { if (repo.all().isEmpty()) {
  repo.insert("1", new DeskRecord.Input("Duplicate invoice escalation", "Iris Lambert", "Billing", "Sampled", "No agent available",LocalDate.now().plusDays(2),"Use fictional scenarios."));
  repo.insert("2", new DeskRecord.Input("Appointment reschedule fallback", "Youssef Martin", "Appointments", "Needs coaching", "Bilingual handoff",LocalDate.now().plusDays(5),"Use fictional scenarios."));
  repo.insert("3", new DeskRecord.Input("Accessible callback route", "Anke De Smet", "Access support", "Verified", "Screen reader route",LocalDate.now().plusDays(8),"Use fictional scenarios."));
  repo.insert("4", new DeskRecord.Input("Unclear direct-debit request", "Iris Lambert", "Billing", "Sampled", "No agent available",LocalDate.now().plusDays(11),"Use fictional scenarios."));
  repo.insert("5", new DeskRecord.Input("French appointment handoff", "Youssef Martin", "Appointments", "Needs coaching", "Bilingual handoff",LocalDate.now().plusDays(14),"Use fictional scenarios."));
  repo.insert("6", new DeskRecord.Input("Agent summary completeness", "Anke De Smet", "Access support", "Verified", "Screen reader route",LocalDate.now().plusDays(17),"Use fictional scenarios."));
  }};
 }
}
