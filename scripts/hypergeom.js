"use strict";

/*
File: hypergeom.js
Zachary Muranaka
Solves a hypergeometric distribution
*/

// Calculates the greatest common denominator between two numbers
function gcd(givenNumber1, givenNumber2)
{
    var greatestCommonDenominator = 1; // Any two numbers' minimum gcd is 1

    for(let i = 1; i <= givenNumber1 && i <= givenNumber2; ++i)
    {
        if(givenNumber1 % i == 0 && givenNumber2 % i == 0) // Checks if i is factor of both integers using modulus division
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
     * Attempting to prevent overflow, if(n - r) is less than r we use it instead
     */
    if(n - r < r)
        r = n - r;

    // Tries to calculate the combination of n and r
    try
    {
        var top = 1; // top holds the value of n * (n - 1) * (n - 2) ...
        var bottom = 1; // bottom holds the value of r * (r - 1) * (r - 2) ...

        if(r != 0)
        {
            /*
             * Because this only loops until r = 0, we only calculate the first r numbers of the factorial
             * This is equivalent to the n * (n - 1) * (n - 2) * ... * (n - r + 1)
             * In other words, it is a reduced factorial of n from n to n - r + 1
             * This is how we calculate nCr with the simplified equation
             * The top is n * (n - 1) * (n - 2) * ... * (n - r + 1) and the bottom is r!
             */
            while(r > 0)
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
        else // n combination 0, where n is any number, is always equal to 1
            top = 1;

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

// Calculates the hypergeometric probability
function probability(popSize, popSuccesses, desiredSuccesses, popFailures, sampleFailures)
{
    var w = 1;

    for(let i = 0; i < desiredSuccesses; i++)
    {
        w = (popSuccesses / popSize) * w;
        popSuccesses--;
        popSize--;
    }

    for(let i = 0; i < sampleFailures; i++)
    {
        w = (popFailures / popSize) * w;
        popFailures--;
        popSize--;
    }

    return w;
}

// Class specification for a Deck object
class Deck
{
    // Constructor for a Deck object, with default values of all zero
    constructor(popSize = 0, popSuccesses = 0, sampleSize = 0, desiredSuccesses = 0)
    {
        // Checks if the numbers they entered allow for a valid Deck
        if(popSize >= popSuccesses && popSize >= sampleSize && popSize >= desiredSuccesses && popSuccesses >= desiredSuccesses &&
        sampleSize >= desiredSuccesses && popSize >= 0 && popSuccesses >= 0 && sampleSize >= 0 && desiredSuccesses >= 0)
        {
            try
            {
                this.popSize = popSize; // The size of the population that is being sampled from
                this.popSuccesses = popSuccesses; // The number of successes within the population
                this.sampleSize = sampleSize; // The size of the sample you take from the entire population
                this.desiredSuccesses = desiredSuccesses; // The amount of successes you are looking for from your sample

                this.popFailures = popSize - popSuccesses; // Calculates the amount of failures throughout the entire population
                this.sampleFailures = sampleSize - desiredSuccesses; // Calculates the number of failures in your sample assuming you get exactly the desired number of successes

                this.combination = ncr(sampleSize, desiredSuccesses); // The combination of sampleSize and desiredSuccesses (nCr, where n = sampleSize and r = desiredSuccesses)
            }
            // It is possible to construct a valid Deck that still results in a divide-by-zero error
            catch(err)
            {
                this.constructorFailure();
            }
        }
        else
            this.constructorFailure();
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
        this.sampleFailures = 0;
        this.combination = 0;
    }

    // Calculates the probability of n or greater successes
    orGreater(exactChance)
    {
        for(let i = this.desiredSuccesses; i < this.sampleSize; i++)
        {
            this.desiredSuccesses++;
            this.combination = ncr(this.sampleSize, this.desiredSuccesses);
            this.sampleFailures = this.sampleSize - this.desiredSuccesses;
            var iChance = probability(this.popSize, this.popSuccesses, this.desiredSuccesses, this.popFailures, this.sampleFailures);
            iChance = iChance * this.combination;
            exactChance += iChance;
        }

        return exactChance;
    }

    // Calculates the probability of n or less successes
    orLess(exactChance)
    {
        for(let i = this.desiredSuccesses; i > 0; i--)
        {
            this.desiredSuccesses--;
            this.combination = ncr(this.sampleSize, this.desiredSuccesses);
            this.sampleFailures = this.sampleSize - this.desiredSuccesses;
            var iChance = probability(this.popSize, this.popSuccesses, this.desiredSuccesses, this.popFailures, this.sampleFailures);
            iChance = iChance * this.combination;
            exactChance += iChance;
        }
        
        return exactChance;
    }

    // The following six methods are getters for class variables
    get sizeOfPopulation(){ return this.popSize; }

    get successesInPopulation(){ return this.popSuccesses; }

    get successesInSample(){ return this.desiredSuccesses; }

    get failuresInPopulation(){ return this.popFailures; }

    get failuresInSample(){ return this.sampleFailures; }

    get sampleCombinations(){ return this.combination; }
}

document.getElementById("calculateBtn").addEventListener("click", calculate); // Clicking the calculatebtn calls the calculate() function

// Add an event listner to every number input that calls the calculate() function when their value changes
var numberInputs = document.querySelectorAll('input[type="number"]');
for(let i = 0; i < numberInputs.length; i++)
    numberInputs[i].addEventListener("change", calculate);


// Add an event listener to the page so pressing enter calls the calculate() function
window.addEventListener("keyup",
function(e)
{
    if(e.keyCode == 13) // 13 is the keycode for enter
        calculate();
});


// Calculates the hypergeometric probability
function calculate()
{
    var popSizeInput, popSuccessesInput, sampleSizeInput, desiredSuccessesInput;
    /* 
     * Sets the local variables to be equal to whatever the user entered in the input boxes.
     * The || 0 means that if the parseInt() does not return a valid number, then the
     * variable is automatically set to 0. For example, if the user entered a number with multiple
     * decimal points, then instead of evaluating it as NaN it would just set it to 0.
     */
    if(document.getElementById("popSize").value >= 0) // If the popSize input is at least 0
    {
        popSizeInput = parseInt(document.getElementById("popSize").value) || 0;
        document.getElementById("popSize").value = popSizeInput;
    }
    else // The user entered a negative number
    {
        popSizeInput = 0;
        document.getElementById("popSize").value = 0;
    }

    if(document.getElementById("popSuccesses").value >= 0) // If the popSuccesses input is at least 0
    {
        popSuccessesInput = parseInt(document.getElementById("popSuccesses").value) || 0;
        document.getElementById("popSuccesses").value = popSuccessesInput;
    }
    else // The user entered a negative number
    {
        popSuccessesInput = 0;
        document.getElementById("popSuccesses").value = 0;
    }

    if(document.getElementById("sampleSize").value >= 0) // If the sampleSize input is at least 0
    {
        sampleSizeInput = parseInt(document.getElementById("sampleSize").value) || 0;
        document.getElementById("sampleSize").value = sampleSizeInput;
    }
    else // The user entered a negative number
    {
        sampleSizeInput = 0;
        document.getElementById("sampleSize").value = 0;
    }

    if(document.getElementById("desiredSuccesses").value >= 0) // If the desiredSuccesses input is at least 0
    {
        desiredSuccessesInput = parseInt(document.getElementById("desiredSuccesses").value) || 0;
        document.getElementById("desiredSuccesses").value = desiredSuccessesInput;
    }
    else // The user entered a negative number
    {
        desiredSuccessesInput = 0;
        document.getElementById("desiredSuccesses").value = 0;
    }

    // Construct two identical deck objects
    var deck = new Deck(popSizeInput, popSuccessesInput, sampleSizeInput, desiredSuccessesInput);
    var deck2 = new Deck(popSizeInput, popSuccessesInput, sampleSizeInput, desiredSuccessesInput);
    
    // Calculate the probabilities
    var exactChance = (probability(deck.sizeOfPopulation, deck.successesInPopulation, deck.successesInSample, deck.failuresInPopulation, deck.failuresInSample) * deck.sampleCombinations);
    var orGreaterChance = deck.orGreater(exactChance);
    var orLessChance = deck2.orLess(exactChance); // We use deck2 because the orGreaterChance method altered deck

    /*
     * Write the HTML for the results
     *
     * The toFixed(18) rounds the numbers to 18 decimal places and converts them to strings
     * The parseFloat() parses the strings back to floats which drops any excess zeroes
     * For example 0.toFixed(18) would be 0.000000000000000000, but parseFloat(0.toFixed(18)) is just 0
     */
    var exactlyHTML = "Chance of exactly desired successes: " + "<b>" + parseFloat(exactChance.toFixed(18)) + "</b>";
    var lessThanHTML = "Chance of less than desired successes: " + "<b>" + parseFloat((orLessChance - exactChance).toFixed(18)) + "</b>";
    var orLessHTML = "Chance of desired successes or less: " + "<b>" + parseFloat(orLessChance.toFixed(18)) + "</b>";
    var greaterThanHTML = "Chance of greater than desired successes: " + "<b>" + parseFloat((orGreaterChance - exactChance).toFixed(18)) + "</b>";
    var orGreaterHTML = "Chance of desired successes or greater: " + "<b>" + parseFloat(orGreaterChance.toFixed(18)) + "</b>";

    // Display the results
    document.getElementById("exactly").innerHTML = exactlyHTML;
    document.getElementById("lessThan").innerHTML = lessThanHTML;
    document.getElementById("orLess").innerHTML = orLessHTML;
    document.getElementById("greaterThan").innerHTML = greaterThanHTML;
    document.getElementById("orGreater").innerHTML = orGreaterHTML;
}
