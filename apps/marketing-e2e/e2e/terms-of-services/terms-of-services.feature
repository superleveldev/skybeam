#Feature: Display of Static Terms of Services Page
#
#    Scenario: Viewing the Terms of Services Page
#        Given I am navigating the website
#        When I click on the Terms of Services link in the footer
#        Then I should be directed to a static page displaying the complete terms of services
#        * the page should include title "Terms of Services"
#        * the page should include Last Updated date at the top
#        * the page should include Section headers:
#            | Agreement                                |
#            | Ad Services                              |
#            | Promotions and Discount Codes            |
#            | Intellectual Property Rights and Privacy |
#