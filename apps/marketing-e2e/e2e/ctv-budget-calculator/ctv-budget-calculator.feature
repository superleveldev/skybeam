Feature: CTV Budget Calculator

    Background: Visit Insights Hub
        Given I visit Insights Hub

    # Scenario: CTV Budget Calculator overview
    #     When I'm on Insights Hub page
    #     Then I can see budget calculator form which contain:
    #         | Monthly Budget                  |                |
    #         | Location                        |                |
    #         | Audience                        |                |
    #         | Estimated Audience Size         | 1.1M - 1.22M   |
    #         | Forecasted Impressions          | 1.17M - 1.94M  |
    #         | Website Visits                  | 735K - 25.08K  |
    #         | Incremental Clicks (Search)     | 14K - 40.83K   |
    #         | Incremental Clicks (Social)     | 5.48K - 31.31K |
    #         | Launch Your TV Ad in 15 Minutes |                |
    # # | Clear All                       |

    Scenario: Calculation for campaign
        When I enter 2500 in Monthly budget field
        And I select Audience
        And I select "New York" Location
        And I click "Launch Your TV Ad in 5 Minutes"