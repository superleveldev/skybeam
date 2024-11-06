#Feature: Pricing page
#
#    The Pricing page outlines the available subscription plans, with clear information about the
#    features of each plan, pricing details, and billing-related FAQs. The page will remain static,
#    meaning no CMS integration is required.
#
#    Background: Pricing navigation
#        Given I am navigating the pricing page
#
#    Scenario: Viewing Pricing Plans
#        Then I should be directed to a static page displaying section "Basic Plan"
#        * "Price" title are shown
#        * the "Basic Plan" section should include the following details:
#            | Basic Plan                |
#            | Free                      |
#            | Targeting Capabilities    |
#            | Ad Inventory & Publishers |
#            | Reporting & Analytics     |
#            | Campaign Management Tools |
#            | Support & Payments        |
#        * "We keep it simple" title and images are shown in middle of page
#        * "Frequently Asked Questions" title shown at the bottom
#
#    Scenario: FAQ section dropdowns
#        Given all dropdowns are closed
#        When I click on FAQ <id> with "<title>"
#        Then "<addtitional text>" appears in dropdown <id>
#
#        Examples:
#            | id | title                                  | addtitional text |
#            | 0  | Is there a free trial available?       | Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible. |
#            | 1  | Can I change my plan later?            | |
#            | 2  | What is your cancellation policy?      | |
#            | 3  | Can other info be added to an invoice? | |
#            | 4  | How does billing work?                 | |
#            | 5  | How do I change my account email?      | |
#
#    Scenario: Redirecting to 'Sign Up' page after clicking 'Get Started' buttons
#        When I click Get Started button in "<button location>"
#        # Then I'm redirected to Sign up page
#
#        Examples:
#            | button location |
#            | top             |
#            | bottom          |
#
#    Scenario: Call to actions component
#        Then call to actions component appears on page
#
