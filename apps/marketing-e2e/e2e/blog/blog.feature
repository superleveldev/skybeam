Feature: Resources page

    Background:
        Given I visit resourses page

    Scenario: Displaying Articles
        Then I should see a list of articles
        And "Skybeam Blog" title and title image are displayed
        And each article preview should display the following:
            | article-card-title |
            | author             |
            | summary            |
            | category           |

    # not finished
    Scenario: Article Clickthrough
        Given I click on an article preview and I'm redirected to the article
    #     And article page contains complete content, images, and related categories
        # When I click back to all articles
        # Then I'm redirected to the resourses page

    #Scenario: Filtering articles
    #   When I click on "Skybeam in the News" category
    #    Then the page contains only article previews that belong to the "Skybeam in the News" category

    Scenario: Call to Action Feature
        Then call to action feature displayed
