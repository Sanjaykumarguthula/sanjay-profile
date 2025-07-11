document.addEventListener('DOMContentLoaded', function () {
    const generatedPasswordInput = document.getElementById('generatedPassword');
    const copyPasswordBtn = document.getElementById('copyPasswordBtn');
    const passwordLengthSlider = document.getElementById('passwordLength');
    const passwordLengthValue = document.getElementById('passwordLengthValue');
    const includeUppercaseCheckbox = document.getElementById('includeUppercase');
    const includeLowercaseCheckbox = document.getElementById('includeLowercase');
    const includeNumbersCheckbox = document.getElementById('includeNumbers');
    const includeSymbolsCheckbox = document.getElementById('includeSymbols');
    const generatePasswordBtn = document.getElementById('generatePasswordBtn');
    const passwordStrengthIndicator = document.getElementById('passwordStrengthIndicator');
    const strengthText = document.getElementById('strengthText');

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    function updateLengthValue() {
        if (passwordLengthSlider && passwordLengthValue) {
            passwordLengthValue.textContent = passwordLengthSlider.value;
        }
    }

    function generatePassword() {
        const length = parseInt(passwordLengthSlider.value);
        let charset = '';
        let password = '';

        if (includeUppercaseCheckbox.checked) charset += uppercaseChars;
        if (includeLowercaseCheckbox.checked) charset += lowercaseChars;
        if (includeNumbersCheckbox.checked) charset += numberChars;
        if (includeSymbolsCheckbox.checked) charset += symbolChars;

        if (charset === '') {
            generatedPasswordInput.value = '';
            alert('Please select at least one character type.');
            updatePasswordStrength(0, '');
            return;
        }

        // Ensure password contains at least one of each selected type if possible and length allows
        let guaranteedChars = '';
        if (includeUppercaseCheckbox.checked) guaranteedChars += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        if (includeLowercaseCheckbox.checked) guaranteedChars += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        if (includeNumbersCheckbox.checked) guaranteedChars += numberChars[Math.floor(Math.random() * numberChars.length)];
        if (includeSymbolsCheckbox.checked) guaranteedChars += symbolChars[Math.floor(Math.random() * symbolChars.length)];

        // Shuffle guaranteed characters
        guaranteedChars = guaranteedChars.split('').sort(() => 0.5 - Math.random()).join('');


        for (let i = 0; i < length - guaranteedChars.length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        // Add guaranteed characters and shuffle the whole thing
        let finalPasswordArray = (password + guaranteedChars).split('');
        if (finalPasswordArray.length > length) { // if guaranteedChars made it longer than requested
            finalPasswordArray = finalPasswordArray.slice(0, length);
        }
        // Shuffle the final array
        for (let i = finalPasswordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [finalPasswordArray[i], finalPasswordArray[j]] = [finalPasswordArray[j], finalPasswordArray[i]];
        }

        generatedPasswordInput.value = finalPasswordArray.join('');
        updatePasswordStrength(length, charset);
    }

    function updatePasswordStrength(length, charset) {
        let score = 0;
        let text = "Very Weak";
        let barClass = "strength-weak";

        if (length >= 8) score++;
        if (length >= 12) score++;
        if (length >= 16) score++;

        let typesCount = 0;
        if (includeUppercaseCheckbox.checked) typesCount++;
        if (includeLowercaseCheckbox.checked) typesCount++;
        if (includeNumbersCheckbox.checked) typesCount++;
        if (includeSymbolsCheckbox.checked) typesCount++;

        if (typesCount >= 2) score++;
        if (typesCount >= 3) score++;
        if (typesCount >= 4) score++;


        if (charset === '' || length === 0) { // handle no selection or cleared password
            score = 0;
        }


        // Determine strength text and bar class based on score
        if (score <= 1) {
            text = "Very Weak";
            barClass = "bg-danger"; // Bootstrap red
            passwordStrengthIndicator.style.width = "20%";
        } else if (score <= 2) {
            text = "Weak";
            barClass = "bg-warning"; // Bootstrap orange
            passwordStrengthIndicator.style.width = "40%";
        } else if (score <= 3) {
            text = "Medium";
            barClass = "bg-info"; // Bootstrap blue
            passwordStrengthIndicator.style.width = "60%";
        } else if (score <= 4) {
            text = "Strong";
            barClass = "bg-success"; // Bootstrap green
            passwordStrengthIndicator.style.width = "80%";
        } else { // score >= 5
            text = "Very Strong";
            barClass = "bg-success border border-dark"; // Bootstrap dark green (custom or darker shade)
            passwordStrengthIndicator.style.width = "100%";
        }

        if (charset === '' || length === 0) {
            text = "";
            passwordStrengthIndicator.style.width = "0%";
        }


        passwordStrengthIndicator.className = `password-strength-indicator ${barClass}`;
        strengthText.textContent = `Strength: ${text}`;
    }


    if (passwordLengthSlider) {
        passwordLengthSlider.addEventListener('input', updateLengthValue);
        updateLengthValue(); // Initial call
    }

    if (generatePasswordBtn) {
        generatePasswordBtn.addEventListener('click', generatePassword);
    }

    // Generate a password on load
    generatePassword();

    // Add event listeners to options to regenerate password
    [passwordLengthSlider, includeUppercaseCheckbox, includeLowercaseCheckbox, includeNumbersCheckbox, includeSymbolsCheckbox].forEach(el => {
        if (el) {
            el.addEventListener('change', generatePassword);
        }
    });


    if (copyPasswordBtn) {
        copyPasswordBtn.addEventListener('click', function() {
            if (generatedPasswordInput.value) {
                navigator.clipboard.writeText(generatedPasswordInput.value).then(() => {
                    const originalIcon = copyPasswordBtn.innerHTML;
                    copyPasswordBtn.innerHTML = '<i class="bx bx-check"></i>'; // Checkmark icon
                    setTimeout(() => {
                        copyPasswordBtn.innerHTML = originalIcon;
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy password: ', err);
                    alert('Failed to copy password. Please copy manually.');
                });
            }
        });
    }
});
