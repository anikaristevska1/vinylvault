package mk.ukim.finki.vinylvault.exception;

public class RecordNotFoundException extends RuntimeException {
    public RecordNotFoundException(Long id) {
        super("Vinyl record with id " + id + " not found");
    }
}
