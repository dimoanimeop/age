
const ageForm = document.getElementById("ageForm");
const birthDateInput = document.getElementById("birthDate");

const result = document.getElementById("result");
const yearsOutput = document.getElementById("years");
const monthsOutput = document.getElementById("months");
const daysOutput = document.getElementById("days");
const nextBirthdayOutput = document.getElementById("nextBirthday");
const errorOutput = document.getElementById("error");

// Prevent selecting a future date
const today = new Date();

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

birthDateInput.max = formatDate(today);

// Handle form submission
ageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    result.hidden = true;
    errorOutput.hidden = true;

    const birthDateValue = birthDateInput.value;

    if (!birthDateValue) {
        showError("Please enter your date of birth.");
        return;
    }

    const [year, month, day] = birthDateValue.split("-").map(Number);

    // Create the birth date using local time
    const birthDate = new Date(year, month - 1, day);

    // Validate the date
    if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month - 1 ||
        birthDate.getDate() !== day
    ) {
        showError("Please enter a valid date.");
        return;
    }

    const currentDate = new Date();

    const todayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    );

    if (birthDate > todayDate) {
        showError("Date of birth cannot be in the future.");
        return;
    }

    // Calculate age in years, months, and days
    let years = todayDate.getFullYear() - year;
    let months = todayDate.getMonth() - (month - 1);
    let days = todayDate.getDate() - day;

    if (days < 0) {
        months--;

        const previousMonth = new Date(
            todayDate.getFullYear(),
            todayDate.getMonth(),
            0
        );

        days += previousMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    yearsOutput.textContent = years;
    monthsOutput.textContent = months;
    daysOutput.textContent = days;

    // Calculate the next birthday
    const currentYear = todayDate.getFullYear();
    let nextBirthday = getBirthdayInYear(year, month - 1, day, currentYear);

    if (nextBirthday < todayDate) {
        nextBirthday = getBirthdayInYear(
            year,
            month - 1,
            day,
            currentYear + 1
        );
    }

    const daysUntilBirthday = Math.round(
        (nextBirthday.getTime() - todayDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysUntilBirthday === 0) {
        nextBirthdayOutput.textContent = "🎉 Happy Birthday! Today is your birthday!";
    } else {
        nextBirthdayOutput.textContent =
            `🎂 Your next birthday is in ${daysUntilBirthday} day` +
            `${daysUntilBirthday === 1 ? "" : "s"}!`;
    }

    result.hidden = false;
});

// Handle birthdays on February 29 in non-leap years
function getBirthdayInYear(birthYear, birthMonth, birthDay, targetYear) {
    let day = birthDay;

    if (birthMonth === 1 && birthDay === 29) {
        const isLeapYear =
            (targetYear % 4 === 0 && targetYear % 100 !== 0) ||
            targetYear % 400 === 0;

        if (!isLeapYear) {
            day = 28;
        }
    }

    return new Date(targetYear, birthMonth, day);
}

// Display errors
function showError(message) {
    errorOutput.textContent = message;
    errorOutput.hidden = false;
}
