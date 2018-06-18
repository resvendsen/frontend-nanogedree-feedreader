/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {

    const bodyMenuHidden = document.querySelector('body.menu-hidden');
    const menuMoveEl = document.querySelector('.menu-icon-link');

    function t() {return new Date().getTime();};

    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */

        // validate that allFeeds is okay
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('URLs present', function() {
            allFeeds.forEach(function (feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            });
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('names present', function() {
            allFeeds.forEach(function (feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
            });
        });
    });


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function() {
        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        const menuEl = document.querySelector('.slide-menu');
        const menuRect = menuEl.getBoundingClientRect();

        it('menu default is hidden', function() {
            expect(bodyMenuHidden).toBeDefined();
            expect(menuRect.x).toBeLessThan(0);
        });

        /* TODO: Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        describe('test menu movement to the right and back', function() {

            const body = document.querySelector('body');

            // used to test for the presence of the menu-hidden class
            const hasClass = function(el, cls) {
                return el.classList.contains(cls);
            };

            // fires off a mouse event 'click' for the element passed in
            function click(el) {
                const ev = document.createEvent("MouseEvent");
                ev.initMouseEvent(
                    "click",
                    true, true,  /* bubble, cancelable */
                    window, null,
                    0, 0, 0, 0,  /* coordinates */
                    false, false, false, false,  /* modifier keys */
                    0 /* left */, null
                );
                el.dispatchEvent(ev);
            };

            it('menu moves right and left', function() {
                click(menuMoveEl);
                expect(hasClass(body, 'menu-hidden')).toBe(false);
                click(menuMoveEl);
                expect(hasClass(body, 'menu-hidden')).toBe(true);
            });
        });
    });

    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {
        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        const feedEl = document.querySelector('.feed');

        beforeEach(function(done) {
            // start the feed load async simulation
            const firstLoad = function() {
                // give it time to complete
                setTimeout(function() {
                    done();
                }, 4500);
            };
            firstLoad();
        });

        it("there's at least one .entry in .feed", function(done) {
            expect(feedEl).toBeDefined();
            expect(feedEl.innerHTML.length).toBeGreaterThan(0);
            const feedListEl = feedEl.querySelector('.entry-link .entry');
            expect(feedListEl.innerText.length).toBeGreaterThan(0);
            done();
        });
    });

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {
        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        let slideMenuItem;
        let initialCount;
        let initialEntry;

/*        if (document.readyState == 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                console.log(t() + ' 2 DOMContentLoaded - current Document Ready State is ' + document.readyState);
            });
            setTimeout(function() {
                console.log(t() + " 6 Timeout done, " + document.readyState);
            }, 500);
        };  */

        // fires off a mouse event 'click' for the element passed in
        function click(el) {
            const ev = document.createEvent("MouseEvent");
            ev.initMouseEvent(
                "click",
                true, true,   /* bubble, cancelable */
                window, null,
                0, 0, 0, 0,   /* coordinates */
                false, false, false, false,   /* modifier keys */
                0 /* left */, null
            );
            el.dispatchEvent(ev);
        };

        const origTimeoutMax = jasmine.DEFAULT_TIMEOUT_INTERVAL;

        beforeEach(function(done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            // trigger a menu entry to see how loadFeed behaves
            const menuSelectLoad = function() {
                // make the menu visible
                document.querySelector('body').classList.toggle('menu-hidden');
                const feedListEl = document.querySelector('.entry-link .entry');
                initialEntry = feedListEl.innerHTML;
                initialCount = feedListEl.innerHTML.length;
                slideMenuItem = document.querySelector('a[data-id="1"]');  // CSS Tricks item
                click(slideMenuItem);
                // simulate async behavior
                setTimeout(function() {
                    done();
                }, 4500);
            };
            menuSelectLoad();
        });

        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeoutMax;
        });

        it("loadFeed actually changes the content", function(done) {
            const feedListEl = document.querySelector('.entry-link .entry');
            expect(initialCount).not.toBe(feedListEl.innerHTML.length);
            expect(initialEntry).not.toBe(feedListEl.innerHTML);
            done();
        });
    });
}());
