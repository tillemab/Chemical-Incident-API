const listValidationErrors = (err) => {

    let validationErrors = [];
  
    // Add the error message to the list
    const errors = Object.values(err["errors"]);
    for (let i = 0; i < errors.length; i++ ) {
      validationErrors.push(errors[i]["message"])
    }
  
    return validationErrors
  
}

module.exports = listValidationErrors;