package uni.hcmus.medicineservice.common.exception;

import java.util.ArrayList;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.apache.commons.lang3.StringUtils;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import uni.hcmus.medicineservice.common.model.dto.CustomError;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * Handles NoHandlerFoundException thrown when a requested endpoint is not
     * found.
     *
     * @param ex The NoHandlerFoundException instance.
     * @return ResponseEntity with CustomError containing details of the exception.
     */
    @ExceptionHandler(org.springframework.web.servlet.NoHandlerFoundException.class)
    protected ResponseEntity<Object> handleNoHandlerFoundException(
                    final org.springframework.web.servlet.NoHandlerFoundException ex) {
            CustomError customError = CustomError.builder()
                            .httpStatus(HttpStatus.NOT_FOUND)
                            .header(CustomError.Header.NOT_FOUND.getName())
                            .message("The requested resource was not found: " + ex.getRequestURL())
                            .build();

            return new ResponseEntity<>(customError, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles MethodArgumentNotValidException thrown when validation on an argument
     * annotated with @Valid fails.
     *
     * @param ex The MethodArgumentNotValidException instance.
     * @return ResponseEntity with CustomError containing details of validation
     *         errors.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValid(final MethodArgumentNotValidException ex) {
            List<CustomError.CustomSubError> subErrors = new ArrayList<>();

            ex.getBindingResult().getAllErrors().forEach(error -> {
                    String fieldName = ((FieldError) error).getField();
                    String message = error.getDefaultMessage();
                    subErrors.add(CustomError.CustomSubError.builder()
                                    .field(fieldName)
                                    .message(message)
                                    .build());
            });

            CustomError customError = CustomError.builder()
                            .httpStatus(HttpStatus.BAD_REQUEST)
                            .header(CustomError.Header.VALIDATION_ERROR.getName())
                            .message("Validation failed")
                            .subErrors(subErrors)
                            .build();

            return new ResponseEntity<>(customError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles ConstraintViolationException thrown when a bean validation constraint
     * is violated.
     *
     * @param constraintViolationException The ConstraintViolationException
     *                                     instance.
     * @return ResponseEntity with CustomError containing details of constraint
     *         violations.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handleConstraintViolation(
                    final ConstraintViolationException constraintViolationException) {

            List<CustomError.CustomSubError> subErrors = new ArrayList<>();
            constraintViolationException.getConstraintViolations()
                            .forEach(constraintViolation -> {
                                    Object invalidValue = constraintViolation.getInvalidValue();
                                    subErrors.add(CustomError.CustomSubError.builder()
                                                    .message(constraintViolation.getMessage())
                                                    .field(StringUtils.substringAfterLast(
                                                                    constraintViolation.getPropertyPath()
                                                                                    .toString(),
                                                                    "."))
                                                    .value(invalidValue != null ? invalidValue.toString() : null)
                                                    .type(invalidValue != null
                                                                    ? invalidValue.getClass().getSimpleName()
                                                                    : null)
                                                    .build());
                            });

            CustomError customError = CustomError.builder()
                            .httpStatus(HttpStatus.BAD_REQUEST)
                            .header(CustomError.Header.VALIDATION_ERROR.getName())
                            .message("Constraint violation")
                            .subErrors(subErrors)
                            .build();

            return new ResponseEntity<>(customError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles DataIntegrityViolationException thrown when there is a data integrity
     * violation.
     *
     * @param ex The DataIntegrityViolationException instance.
     * @return ResponseEntity with CustomError containing details of the exception.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<Object> handleDataIntegrityViolation(final DataIntegrityViolationException ex) {
            CustomError customError = CustomError.builder()
                            .httpStatus(HttpStatus.CONFLICT)
                            .header(CustomError.Header.DATABASE_ERROR.getName())
                            .message("Database integrity constraint violated")
                            .build();

            return new ResponseEntity<>(customError, HttpStatus.CONFLICT);
    }

    /**
     * Handles RuntimeException thrown for general runtime exceptions.
     *
     * @param runtimeException The RuntimeException instance.
     * @return ResponseEntity with CustomError containing details of the runtime
     *         exception.
     */
    @ExceptionHandler(RuntimeException.class)
    protected ResponseEntity<?> handleRuntimeException(final RuntimeException runtimeException) {
            CustomError customError = CustomError.builder()
                            .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                            .header(CustomError.Header.API_ERROR.getName())
                            .message(runtimeException.getMessage())
                            .build();

            return new ResponseEntity<>(customError, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    
}
