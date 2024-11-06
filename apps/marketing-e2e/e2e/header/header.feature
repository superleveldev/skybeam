Feature: Header navigation

    Background:
        Given I visit landing page

    Scenario: Header links
        When I click "<menu option>"
        # Then I'm redirecting to "<menu option>" page

        Examples:
            | menu option |
            | /insights   |
            | /resources  |
            | /pricing    |
            | /about      |

    Scenario: Burger menu options
        Given I visit landing page with window size 1300 and 1000
        When I open burger menu
        And I select "<menu option>"
        # Then I'm redirected to "<menu option>" page

        Examples:
            | menu option |
            | /insights   |
            | /resources  |
            | /pricing    |
            | /about      |

    Scenario: Redirecting to 'Sign Up' and 'Log in' page using navbar
        When I click "<button name>" button
        # Then I'm redirected to "<button name>" page

        Examples:
            | button name |
            | sign-up     |
            | log-in      |
