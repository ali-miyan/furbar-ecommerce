function validateCategoryForm() {
    let name = $('#categoryName').val();
    let description = $('#categoryDescription').val();

    // Reset error messages
    $('#nameError').text('');
    $('#descriptionError').text('');

    // Validate Name
    if (name.trim() === '') {
        $('#nameError').text('Name cannot be empty');
        return;
    }

    // Validate Description
    if (description.trim() === '') {
        $('#descriptionError').text('Description cannot be empty');
        return;
    }

    // If all validations pass, submit the form
    $('#categoryForm').submit();
}

function validateEditCategoryForm() {
    let name = $('#categoryName').val();
    let description = $('#categoryDescription').val();
    let isValid = true;

    // Reset error messages
    $('#nameError').text('');
    $('#descriptionError').text('');

    // Validate Name
    if (name.trim() === '') {
        $('#nameError').text('Name cannot be empty');
        isValid = false;
    }

    // Validate Description
    if (description.trim() === '') {
        $('#descriptionError').text('Description cannot be empty');
        isValid = false;
    }

    return isValid;
}


//product edit
document.addEventListener('DOMContentLoaded', function () {
    function validateAddProductForm() {
        clearErrorMessages();

        let isValid = true;

        // Validate Product Title
        let productTitle = document.getElementById('product_title').value.trim();
        if (productTitle === '') {
            showError('productTitleError', 'Product title cannot be empty');
            isValid = false;
        }

        // Validate Quantity
        let quantity = document.getElementById('quantity').value.trim();
        if (quantity === '' || isNaN(quantity) || parseInt(quantity) <= 0) {
            showError('quantityError', 'Please enter a valid quantity');
            isValid = false;
        }

        // Validate Price
        let price = document.getElementById('price').value.trim();
        if (price === '' || isNaN(price) || parseFloat(price) <= 0) {
            showError('priceError', 'Please enter a valid price');
            isValid = false;
        }

        // Validate Description
        let description = document.getElementById('description').value.trim();
        if (description === '') {
            showError('descriptionError', 'Description cannot be empty');
            isValid = false;
        }

        let imageCount = 0;

        document.querySelectorAll('.imageInput').forEach(function (element) {
            if (element.files.length > 0) {
                imageCount++;
            }
        });

        if (imageCount < 4) {
            showError('imageError', 'Images cannot be empty');
            isValid = false;
        }

        return isValid;
    }

    function clearErrorMessages() {
        document.querySelectorAll('.error-message').forEach(function (element) {
            element.textContent = '';
        });
    }

    function showError(id, message) {
        document.getElementById(id).textContent = message;
    }

    document.getElementById('addProductForm').addEventListener('submit', function (event) {
        if (!validateAddProductForm()) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    });
});

//edit product validation
    document.getElementById('editProductForm').addEventListener('submit', function (event) {
        document.getElementById('productTitleError').innerHTML = '';
        document.getElementById('quantityError').innerHTML = '';
        document.getElementById('priceError').innerHTML = '';
        document.getElementById('imageError').innerHTML = '';

        let productTitle = document.getElementById('product_title').value.trim();
        if (productTitle === '') {
            document.getElementById('productTitleError').innerHTML = 'Product title cannot be empty';
            event.preventDefault();
        }

        let quantity = document.getElementById('quantity').value.trim();
        if (quantity === '' || isNaN(quantity) || quantity <= 0) {
            document.getElementById('quantityError').innerHTML = 'Please enter a valid quantity';
            event.preventDefault();
        }

        let price = document.getElementById('price').value.trim();
        if (price === '' || isNaN(price) || price <= 0) {
            document.getElementById('priceError').innerHTML = 'Please enter a valid price';
            event.preventDefault();
        }

        let imageInputs = document.querySelectorAll('.imageInput');
        let allImagesFilled = Array.from(imageInputs).every(input => input.value !== '');
        if (!allImagesFilled) {
            document.getElementById('imageError').innerHTML = 'Please fill in all image fields';
            event.preventDefault();
        }
    });

//coupon validation
function validateCouponForm() {
    clearErrorMessages();

    let isValid = true;

    // Validate Coupon Name
    let name = document.getElementById('name').value.trim();
    if (name === '') {
        showError('nameError', 'Coupon name cannot be empty');
        isValid = false;
    }

    // Validate Coupon Code
    let code = document.getElementById('code').value.trim();
    if (code === '') {
        showError('codeError', 'Coupon code cannot be empty');
        isValid = false;
    }

    // Validate Discount Amount
    let discount = document.getElementById('discount').value.trim();
    if (discount === '' || isNaN(discount) || parseFloat(discount) <= 0) {
        showError('discountError', 'Please enter a valid discount amount');
        isValid = false;
    }

    // Validate Activation Date
    let activationdate = document.getElementById('activationdate').value.trim();
    if (activationdate === '') {
        showError('activationdateError', 'Activation date cannot be empty');
        isValid = false;
    }

    // Validate Expire Date
    let expirydate = document.getElementById('expirydate').value.trim();
    if (expirydate === '') {
        showError('expirydateError', 'Expire date cannot be empty');
        isValid = false;
    }

    // Validate Criteria Amount
    let criteriamount = document.getElementById('criteriamount').value.trim();
    if (criteriamount === '' || isNaN(criteriamount) || parseFloat(criteriamount) <= 0) {
        showError('criteriamountError', 'Please enter a valid criteria amount');
        isValid = false;
    }

    return isValid;
}

function clearErrorMessages() {
    document.querySelectorAll('.error-message').forEach(function (element) {
        element.textContent = '';
    });
}

function showError(id, message) {
    document.getElementById(id).textContent = message;
}


//offer validation

function validateOfferForm() {
    clearErrorMessages();

    let isValid = true;

    // Validate Offer Name
    let name = document.getElementById('name').value.trim();
    if (name === '') {
        showError('nameError', 'Offer name cannot be empty');
        isValid = false;
    }

    // Validate Discount Percentage
    let discount = document.getElementById('discount').value.trim();
    if (discount === '' || isNaN(discount) || parseFloat(discount) <= 0) {
        showError('discountError', 'Please enter a valid discount percentage');
        isValid = false;
    }

    // Validate Activation Date
    let activationDate = document.getElementById('activationDate').value.trim();
    if (activationDate === '') {
        showError('activationDateError', 'Activation date cannot be empty');
        isValid = false;
    }

    // Validate Expiry Date
    let expiryDate = document.getElementById('expiryDate').value.trim();
    if (expiryDate === '') {
        showError('expiryDateError', 'Expiry date cannot be empty');
        isValid = false;
    }

    return isValid;
}

function clearErrorMessages() {
    document.querySelectorAll('.error-message').forEach(function (element) {
        element.textContent = '';
    });
}

function showError(id, message) {
    document.getElementById(id).textContent = message;
}