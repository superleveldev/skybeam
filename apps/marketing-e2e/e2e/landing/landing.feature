Feature: Landing

    Background:
        Given I visit landing page

    Scenario: Redirecting to 'Sign Up' page after clicking 'Get Started' buttons
        When I click Get Started button in "<button location>"
        # Then I'm redirected to Sign up page

        Examples:
            | button location |
            | top             |
            | bottom          |

    Scenario: FAQs text dropdowns
        Given all dropdowns are closed
        When I click on FAQ <dropdown id>
        Then addtitional text appears in <dropdown id>

        Examples:
            | dropdown id |
            | 0           |
            | 1           |
            | 2           |
            | 3           |
            | 4           |
            | 5           |

    Scenario: Call to Action and Key Features Visibility
        Given I visit landing page
        Then "Supercharge Your Search and Social with TV ads" title displays
        * next text shows under title:
            """
            Integrate TV into your digital strategy with Skybeam™ TV Ads Manager: 
            launch smarter campaigns, gain deeper insights, and amplify your results
            """
        * "Your Digital Campaigns, Now Powered by TV" first subtitle displays
        * "Turn TV into Your Next Performance Powerhouse" second subtitle displays
        * Advertise on section displays
        * Powered by section contain text:
            """
            Skybeam harnesses the expertise of Simulmedia, a trailblazer in TV advertising since 2008. 
            Their TV+® platform, which powers campaigns for numerous top brands, combines linear TV and 
            streaming capabilities to deliver exceptional results. With Skybeam, you're not just getting 
            a new tool; you're accessing years of industry-leading expertise and technology, tailored for your needs.
            """