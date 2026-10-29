import test from 'node:test';
import assert from 'node:assert/strict';
import { TEAM_MEMBERS } from './team';

test('team members validation: Pratibha is the only female and all others are male', () => {
  assert.equal(TEAM_MEMBERS.length, 5, 'Must have exactly 5 founding team members');

  const pratibha = TEAM_MEMBERS.find((m) => m.id === 'pratibha');
  assert.ok(pratibha, 'Pratibha must exist in the team');
  assert.equal(pratibha.gender, 'female', 'Pratibha must have gender female');
  assert.equal(pratibha.role, 'Chief Financial Officer (CFO)');

  const otherMembers = TEAM_MEMBERS.filter((m) => m.id !== 'pratibha');
  assert.equal(otherMembers.length, 4, 'Must have 4 male members');

  for (const member of otherMembers) {
    assert.equal(
      member.gender,
      'male',
      `Member ${member.name} (${member.id}) must be male, but found ${member.gender}`
    );
    assert.ok(member.college, `Member ${member.name} must have a college defined`);
    assert.ok(member.skills.length > 0, `Member ${member.name} must have skills`);
    assert.ok(member.image.startsWith('http'), `Member ${member.name} must have a valid photo URL`);
  }
});
