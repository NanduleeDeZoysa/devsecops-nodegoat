/// <reference types="Cypress" />

describe("/allocations behaviour", () => {
  "use strict";

  const OWN_ID = 2;    // user1 in the seed data
  const OTHER_ID = 1;  // admin

  before(() => {
    cy.dbReset();
  });

  afterEach(() => {
    cy.visitPage("/logout");
  });

  it("Should redirect if the user has not logged in", () => {
    cy.visitPage(`/allocations/${OWN_ID}`);
    cy.url().should("include", "login");
  });

  it("Should be accesible for a logged user", () => {
    cy.userSignIn();
    cy.visitPage(`/allocations/${OWN_ID}`);
    cy.url().should("include", "allocations");
  });

  it("Should be an input", () => {
    cy.userSignIn();
    cy.visitPage(`/allocations/${OWN_ID}`);
    cy.get("input[name='threshold']");
  });

  it("Should redirect the user", () => {
    const threshold = 2;
    cy.userSignIn();
    cy.visitPage(`/allocations/${OWN_ID}`);

    cy.get("input[name='threshold']").clear().type(threshold);
    cy.get("button[type='submit']").click();

    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?threshold=${threshold}`);
      expect(loc.pathname).to.eq(`/allocations/${OWN_ID}`);
    });
  });

  // Regression test for the IDOR fix
  it("Should forbid access to another user's allocations", () => {
    cy.userSignIn();
    cy.request({
      url: `/allocations/${OTHER_ID}`,
      failOnStatusCode: false,
    }).its("status").should("eq", 403);
  });
});