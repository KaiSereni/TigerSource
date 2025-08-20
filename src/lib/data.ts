export type Club = {
  name: string;
  description: string;
  tags: string[];
};

export const allClubs: Club[] = [
    { name: 'RITSEC', description: 'The cybersecurity club, for hackers and security enthusiasts.', tags: ['academic', 'tech', 'professional'] },
    { name: 'Society of Software Engineers', description: 'A club for students passionate about software development.', tags: ['academic', 'tech', 'professional'] },
    { name: 'Art & Animation Club', description: 'Explore various forms of art and animation with fellow creatives.', tags: ['artistic', 'hobby', 'creative'] },
    { name: 'RIT Players', description: 'A student-run theater organization producing several shows a year.', tags: ['artistic', 'performing arts', 'creative'] },
    { name: 'Student Government', description: 'Represent the student body and make a difference on campus.', tags: ['professional', 'leadership', 'service'] },
    { name: 'Global Union', description: 'Celebrating cultural diversity and hosting events from around the world.', tags: ['cultural', 'social'] },
    { name: 'Rock Climbing Club', description: 'For climbers of all levels, with trips to local gyms and crags.', tags: ['sports', 'hobby', 'physical'] },
    { name: 'Running Club', description: 'Join fellow runners for group runs and training for races.', tags: ['sports', 'physical'] },
    { name: 'Board Game Club', description: 'A casual club for playing modern and classic board games.', tags: ['hobby', 'social', 'gaming'] },
    { name: 'RIT Game Symphony', description: 'An orchestra dedicated to performing music from video games.', tags: ['artistic', 'performing arts', 'gaming'] },
    { name: 'Engineers for a Sustainable World', description: 'Using engineering skills to tackle sustainability challenges.', tags: ['academic', 'service', 'professional'] },
    { name: 'RIT Model UN', description: 'Debate international affairs and represent countries in simulations.', tags: ['academic', 'professional', 'leadership'] },
    { name: 'Photography Club', description: 'Share your passion for photography through workshops and photo walks.', tags: ['artistic', 'hobby', 'creative'] },
    { name: 'Women in Computing', description: 'Supporting and promoting women in the field of computing.', tags: ['professional', 'tech', 'academic'] },
    { name: 'RIT VSA (Vietnamese Student Association)', description: 'Promoting Vietnamese culture and heritage.', tags: ['cultural', 'social'] },
    { name: 'Latin American Student Association (LASA)', description: 'Celebrating and sharing Latin American culture.', tags: ['cultural', 'social'] },
    { name: 'RIT Chess Club', description: 'For chess players of all skill levels, from beginner to grandmaster.', tags: ['hobby', 'gaming'] },
    { name: 'RIT Bowling Club', description: 'Hit the lanes with the RIT Bowling Club for fun and competition.', tags: ['sports', 'hobby', 'social'] },
    { name: 'RIT Ski and Snowboard Club', description: 'Hitting the slopes during the winter months.', tags: ['sports', 'hobby'] },
    { name: 'Electronic Gaming Society', description: 'The hub for competitive and casual video gaming at RIT.', tags: ['gaming', 'social', 'tech'] },
    { name: 'RIT BIg Band', description: 'A full-sized jazz ensemble playing classic and modern charts.', tags: ['artistic', 'performing arts'] },
    { name: 'Out in Science, Technology, Engineering, and Mathematics (oSTEM)', description: 'A professional and social group for LGBTQ+ students in STEM.', tags: ['professional', 'social', 'lgbtq+'] },
    { name: 'National Society of Black Engineers (NSBE)', description: 'Fostering academic and professional success for Black engineering students.', tags: ['professional', 'academic', 'cultural'] },
    { name: 'Society of Hispanic Professional Engineers (SHPE)', description: 'A network of Hispanic leaders in the STEM field.', tags: ['professional', 'academic', 'cultural'] },
    { name: 'RIT Fencing Club', description: 'Learn the art of fencing with foil, epee, and sabre.', tags: ['sports', 'hobby', 'physical'] },
    { name: 'RIT Entrepreneurs', description: 'A club for students interested in startups and innovation.', tags: ['professional', 'leadership'] },
    { name: 'RIT Beekeepers', description: 'Learn about beekeeping and help maintain hives on campus.', tags: ['hobby', 'service'] },
    { name: 'RIT Foodies', description: 'Explore local cuisine and share your love for all things food.', tags: ['social', 'hobby'] },
    { name: 'RIT Film and Animation Club', description: 'Discuss, watch, and create films and animations.', tags: ['artistic', 'creative'] },
    { name: 'RIT Linux Users Group (RITlug)', description: 'For enthusiasts of Linux and open-source software.', tags: ['tech', 'academic'] },
];

export type Resource = {
    name: string;
    link: string;
    description: string;
};

export const allResources: Resource[] = [
    { name: 'My RIT', link: 'https://my.rit.edu', description: 'A personalized dashboard for accessing RIT resources.' },
    { name: 'SIS', link: 'https://sis.rit.edu', description: 'The Student Information System for managing academic records.' },
    { name: 'StarRez', link: 'https://starrez.rit.edu', description: 'The housing portal for on-campus living.' },
    { name: 'CampusGroups', link: 'https://campusgroups.rit.edu', description: 'A platform for finding clubs and campus events.' },
];
