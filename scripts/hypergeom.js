"use strict";

/*
File: hypergeom.js
Zachary Muranaka
Solves a hypergeometric distribution
*/

// Array that contains the input boxes from the document
const inputBoxes = document.querySelectorAll('input[type="number"]');

// Array that contains the results list items from the document
const resultsList = document.getElementById("results").getElementsByTagName("li");

// Calculates the greatest common denominator between two numbers
function gcd(givenNumber1, givenNumber2)
{
    var greatestCommonDenominator = 1; // Any two numbers' minimum gcd is 1

    for (let i = 1; i <= givenNumber1 && i <= givenNumber2; ++i)
    {
        if (givenNumber1 % i == 0 && givenNumber2 % i == 0) // Checks if i is factor of both integers using modulus division
            greatestCommonDenominator = i;
    }

    return greatestCommonDenominator;
}

/*
 * Calculates a combination of n and r
 * The equation for nCr is (n!) / ((r!) * (n - r)!)
 * This can be simplified to n * (n - 1) * (n - 2) * ... * (n - r + 1) / r!
 * This method calculates nCr using this simplified equation
 * Within a Deck object, n = sampleSize and r = desiredSuccesses
 */
function ncr(n, r)
{
    /*
     * The combination of n and r is equal to the combination of n and (n - r)
     * For example, 17 combination 13 is the same as 17 combination 4
     * Therefore, we can substitute (n - r) for r if we have a larger r value
     * Attempting to prevent overflow, if (n - r) is less than r we use it instead
     */
    if (n - r < r) r = n - r;

    // Tries to calculate the combination of n and r
    try
    {
        var top = 1; // top holds the value of n * (n - 1) * (n - 2) ...
        var bottom = 1; // bottom holds the value of r * (r - 1) * (r - 2) ...

        if (r)
        {
            /*
             * Because this only loops until r = 0, we only calculate the first r numbers of the factorial
             * This is equivalent to the n * (n - 1) * (n - 2) * ... * (n - r + 1)
             * In other words, it is a reduced factorial of n from n to n - r + 1
             * This is how we calculate nCr with the simplified equation
             * The top is n * (n - 1) * (n - 2) * ... * (n - r + 1) and the bottom is r!
             */
            while (r)
            {
                top *= n;
                bottom *= r;

                var greatestCommonDenominator = gcd(top, bottom);

                // Divides the top and bottom of the fraction by their gcd to help prevent overflow
                top /= greatestCommonDenominator;
                bottom /= greatestCommonDenominator;

                n--;
                r--;
            }
        }
        else top = 1; // n combination 0, where n is any number, is always equal to 1

        /*
         * A factorial always simplifies to a whole number
         * Therefore, we can just return the top, because using the gcd division, bottom should simplify to 1
         * In the case where r = 0, we simply store 1 in top because n combination 0 is always 1
         */
        return top;
    }
    // There was a divide-by-zero error
    catch(err)
    {
        return 1; // Returns a default value of 1
    }
}

// Class specification for a Deck object
class Deck
{
    // Constructor for a Deck object, with default values of all zero
    constructor(popSize = 0, popSuccesses = 0, sampleSize = 0, desiredSuccesses = 0)
    {
        // Checks if the numbers they entered allow for a valid Deck
        if (popSize >= popSuccesses && popSize >= sampleSize && popSize >= desiredSuccesses
            && popSuccesses >= desiredSuccesses && sampleSize >= desiredSuccesses
            && popSize >= 0 && popSuccesses >= 0 && sampleSize >= 0 && desiredSuccesses >= 0)
        {
            try
            {
                this.popSize = popSize; // The size of the population that is being sampled from
                this.popSuccesses = popSuccesses; // The number of successes within the population
                this.sampleSize = sampleSize; // The size of the sample you take from the entire population
                this.desiredSuccesses = desiredSuccesses; // The amount of successes you are looking for from your sample
                this.popFailures = popSize - popSuccesses;

                this.exactChance = this.probability(this.desiredSuccesses);
                this.orGreaterInclusiveChance = this.orGreater(this.exactChance);
                this.orLessInclusiveChance = this.orLess(this.exactChance);
            }
            // It is possible to construct a valid Deck that still results in a divide-by-zero error
            catch(err)
            {
                this.constructorFailure();
            }
        }
        else this.constructorFailure();
    }

    // The numbers the user entered failed to construct a valid Deck object
    constructorFailure()
    {
        // Set all variables equal to 0
        this.popSize = 0;
        this.popSuccesses = 0;
        this.sampleSize = 0;
        this.desiredSuccesses = 0;
        this.popFailures = 0;
        this.exactChance = 0;
        this.orGreaterInclusiveChance = 0;
        this.orLessInclusiveChance = 0;
    }

    // Calculates the hypergeometric probability
    probability(currentDesiredSuccesses)
    {
        // Local variables are used so the member variables of the class are not changed
        var localPopSize = this.popSize;
        var localPopSuccesses = this.popSuccesses;
        var localPopFailures = this.popFailures;
        var sampleFailures = this.sampleSize - currentDesiredSuccesses;

        var prob = 1;
        var combination = ncr(this.sampleSize, currentDesiredSuccesses);

        // Calculate the probability from the successes
        while (currentDesiredSuccesses > 0)
        {
            prob *= (localPopSuccesses / localPopSize);
            localPopSuccesses--;
            localPopSize--;
            currentDesiredSuccesses--;
        }

        // Calculate the probability from the failures
        while (sampleFailures > 0)
        {
            prob *= (localPopFailures / localPopSize);
            localPopFailures--;
            localPopSize--;
            sampleFailures--;
        }

        return prob * combination;
    }

    // Calculates the probability of n or greater successes
    orGreater(exactChance)
    {
        var tempDesiredSuccesses = this.desiredSuccesses;

        while (tempDesiredSuccesses < this.sampleSize)
        {
            tempDesiredSuccesses++;
            exactChance += this.probability(tempDesiredSuccesses);
        }

        return exactChance;
    }

    // Calculates the probability of n or less successes
    orLess(exactChance)
    {
        var tempDesiredSuccesses = this.desiredSuccesses;

        while (tempDesiredSuccesses > 0)
        {
            tempDesiredSuccesses--;
            exactChance += this.probability(tempDesiredSuccesses);
        }
        
        return exactChance;
    }

    // The following six methods are getters for class variables
    get exact() { return this.exactChance; }
    get orGreaterInclusive() { return this.orGreaterInclusiveChance; }
    get orLessInclusive() { return this.orLessInclusiveChance; }
}

document.getElementById("calculateBtn").addEventListener("click", calculate); // Clicking the calculatebtn calls the calculate() function

// Add an event listner to every number input that calls the calculate() function when their value changes
for (let i = 0; i < inputBoxes.length; i++)
    inputBoxes[i].addEventListener("change", calculate);


// Add an event listener to the page so pressing enter calls the calculate() function
window.addEventListener("keyup",
function(e)
{
    if (e.key == "Enter") calculate();
});


// Calculates the hypergeometric probability and dynamically writes the results to the HTML
function calculate()
{
    var userInputs = [0, 0, 0, 0]; // Array that contains the user's input from the document

    /* 
     * Sets the local variables to be equal to whatever the user entered in the input boxes.
     * The || 0 means that if the parseInt() does not return a valid number, then the
     * variable is automatically set to 0. For example, if the user entered a number with multiple
     * decimal points, then instead of evaluating it as NaN it would just set it to 0.
     */
    for (let i = 0; i < inputBoxes.length; i++)
    {
        if (inputBoxes[i].value >= 0) // If the input is at least 0
        {
            userInputs[i] = parseInt(inputBoxes[i].value) || 0;
            inputBoxes[i].value = userInputs[i];
        }
        else // The user entered a negative number
        {
            userInputs[i] = 0;
            inputBoxes[i].value = 0;
        }
    }

    // Construct a Deck object from the user's input
    var deck = new Deck(userInputs[0], userInputs[1], userInputs[2], userInputs[3]);

    /*
     * Write the results to the HTML
     *
     * The toFixed(18) rounds the numbers to 18 decimal places and converts them to strings
     * The parseFloat() parses the strings back to floats which drops any excess zeroes
     * For example 0.toFixed(18) would be 0.000000000000000000, but parseFloat(0.toFixed(18)) is just 0
     */
    resultsList[0].innerHTML = "Chance of exactly desired successes: " + "<b>" + parseFloat(deck.exact.toFixed(18)) + "</b>";
    resultsList[1].innerHTML = "Chance of less than desired successes: " + "<b>" + parseFloat((deck.orLessInclusive - deck.exact).toFixed(18)) + "</b>";
    resultsList[2].innerHTML = "Chance of desired successes or less: " + "<b>" + parseFloat(deck.orLessInclusive.toFixed(18)) + "</b>";
    resultsList[3].innerHTML = "Chance of greater than desired successes: " + "<b>" + parseFloat((deck.orGreaterInclusive - deck.exact).toFixed(18)) + "</b>";
    resultsList[4].innerHTML = "Chance of desired successes or greater: " + "<b>" + parseFloat(deck.orGreaterInclusive.toFixed(18)) + "</b>";
}
