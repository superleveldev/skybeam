Feature: Display of Static About Us Page

    Background: Background name
        Given I am navigating the About Us Page

    Scenario: Viewing company overview
        Then the page title should include "Reach More with Skybeam"
        * "introduction-info" and "image-banner" displays

    Scenario: Our Team section
        Then "Our Team" section displays
        And "<person>" displays with "<role>" and headshot

        Examples:
            | person          | role                            |
            | Dave Morgan     | Chief Executive Officer         |
            | Steve Paule     | Chief Technology Officer        |
            | Matthieu Labour | Engineering                     |
            | Greg Gallet     | Product                         |

    Scenario: Powered by Simulmedia
        Then Powered by Simulmedia section displayed

#    Scenario: Setup Hubspot meeting
#        When I'm om the page, I can see HubSpot-Meeting component
#        * I can select next day
#        * I can select meeting duration
#        * I can select "4:00" timeslot
#        * I can fill first name, last name and email
#        Then I see a notification about a successfully booked meeting
