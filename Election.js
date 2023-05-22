const { expect } = require("chai");

describe("Election", () => {
  let election;
  let electionComission;
  let voter1;
  let voter2;
  let voter3;

  before(async () => {
    const Election = await ethers.getContractFactory("Election");
    [electionComission, voter1, voter2, voter3] = await ethers.getSigners();
    election = await Election.deploy();
    await election.deployed();
  });

  it("should have the correct electionComission address: ", async () => {
    expect(await election.ElectionComission()).to.equal(
      electionComission.address
    );
  });

  it("should allow the election comission to add voters", async () => {
    await election.addVoters(voter1.address);
    await election.addVoters(voter2.address);
    await election.addVoters(voter3.address);

    expect(await election.voters(voter1.address)).to.equal(true);
    expect(await election.voters(voter2.address)).to.equal(true);
    expect(await election.voters(voter3.address)).to.equal(true);
  });

  it("should allow the election comission to remove voters", async () => {
    await election.removeVoters(voter3.address);
    expect(await election.voters(voter3.address)).to.equal(false);
  });

  it("should allow the eligible voters to vote", async () => {
    await election.connect(voter1).vote(0);
    await election.connect(voter2).vote(1);
    expect(await election.votes(0)).to.equal(1);
    expect(await election.votes(0)).to.equal(1);
  });

  it("should allow ineligible voters to vote", async () => {
    await expect(election.connect(voter3).vote(2)).to.be.revertedWith(
      "you are not eligible to vote"
    );
  });
});
