# JavaScript Hypergeometric Calculator

## What is this Project?

This project is a hypergeometric calculator GUI built with HTML, CSS, and JavaScript. Hypergeometric calculators determine the probability to get a desired number of successes out of a number of draws from a population without replacement. For example, if you have a standard deck of playing cards, and you want to determine the probability that you get all four aces out of a hand of five cards, a hypergeometric calculator can solve that.

## How do I use the Website?

All you need to do is provide the population size, population successes, sample size, and desired successes, and then click the 'Calculate' button, and the calculator will tell you what the probability is.

## What do the Variables Mean?

Population size  
&nbsp;&nbsp;&nbsp;&nbsp;Population size means the total number of individuals in the population that you are sampling from. For example, in a standard deck of cards there are 52 cards, so if you are drawing a hand from a standard deck of cards, then the "population size" is 52.  
Population successes  
&nbsp;&nbsp;&nbsp;&nbsp;Population successes means the number of "successes" in the entire population, where "successes" just means the type of individual you are looking for. For example, if you are looking for diamonds out of a standard deck of cards then the "population successes" is 13, because there are 13 diamonds in a standard deck.  
Sample size  
&nbsp;&nbsp;&nbsp;&nbsp;Sample size means the number of draws you are taking from the population. For example, a standard poker hand is 5 cards, so if you are looking for the probability you get a certain number of successes from a standard poker hand, the "sample size" is 5.  
Desired successes  
&nbsp;&nbsp;&nbsp;&nbsp;Desired successes means the number of "successes" you would like to draw in your sample size. For example, if you are looking for the probability of getting all four aces in a standard poker hand, the "desired successes" is 4.

## Directories:

images  
&nbsp;&nbsp;&nbsp;&nbsp;This folder contains the social media logos.  
scripts  
&nbsp;&nbsp;&nbsp;&nbsp;This folder contains the JavaScript that solves the hypergeometric distribution.  
styles  
&nbsp;&nbsp;&nbsp;&nbsp;This folder contains the stylesheet for the website.

## Sources:

I got the GitHub logo from [GitHub](https://github.com/logos) and I created the mail and link logos in Adobe Photoshop.  
Websites that helped me create the project:  
https://stattrek.com/online-calculator/hypergeometric.aspx  
&nbsp;&nbsp;&nbsp;&nbsp;The entire inspiration of the project came from this website. My website is laid out similarly, from the order the information is asked to how it is displayed. I also used this website when checking that my program was coming up with the correct numbers.  
https://www.geeksforgeeks.org/program-to-calculate-the-value-of-ncr-efficiently/  
&nbsp;&nbsp;&nbsp;&nbsp;This page was very helpful when I was trying to find out how to calculate the combination of n and r without overflowing the long data type. It is still not a perfect solution, but it is much better than what I had come up with.  
https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp  
&nbsp;&nbsp;&nbsp;&nbsp;W3Schools was very helpful when I was checking that my syntax was correct and as a general reference. For example, the webpage I linked helped me figure out how to call a function when the user presses the 'enter' key.

## Author:

Zachary Muranaka  
&nbsp;&nbsp;&nbsp;&nbsp;zacharymuranaka@mail.weber.edu  
&nbsp;&nbsp;&nbsp;&nbsp;https://zmuranaka.github.io
