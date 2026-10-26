/* ===== BOOK FINDER DATA - DEMO RECORDS ONLY =====
   Nothing here is confirmed to exist in the LPU Library. Replace with an authorised catalogue export.
   STAFF: to add a category, add one line to "categories" (no code change). A book whose category id is
   not listed falls into "Other / uncategorized". Categories with no books are hidden automatically
   (so "Children's books" appears only once at least one children's record exists).
   Copy format: [location, 'a' (available) | 'b' (borrowed), dueDate 'YYYY-MM-DD' or null] */
window.BOOK_FINDER_DATA = {
  meta: { notice: 'Demo records for prototype use only. These titles, authors, ISBNs and copy statuses are fictional and not connected to the LPU Library catalogue.' },
  categories: [
    { id: 'academic',  name: 'Academic textbooks & reference', subs: ['Textbooks', 'Encyclopedias', 'Dictionaries', 'Handbooks'] },
    { id: 'fiction',   name: 'Fiction, novels & literature',    subs: ['Novels', 'Short stories', 'Classics', 'Drama'] },
    { id: 'nonfic',    name: 'Non-fiction & general knowledge', subs: ['General knowledge', 'Essays', 'Travel', 'True stories'] },
    { id: 'selfhelp',  name: 'Self-help, psychology & personal development', subs: ['Self-help', 'Psychology', 'Productivity'] },
    { id: 'exams',     name: 'Competitive exams & placement prep', subs: ['Aptitude', 'Interview preparation', 'Government exams', 'Entrance exams'] },
    { id: 'cs',        name: 'Computer science, technology & programming', subs: ['Programming', 'Data structures & algorithms', 'AI & data science', 'Networks & security'] },
    { id: 'business',  name: 'Business, economics & management', subs: ['Management', 'Economics', 'Finance & accounting', 'Marketing'] },
    { id: 'science',   name: 'Science, mathematics & engineering', subs: ['Physics', 'Chemistry', 'Mathematics', 'Engineering'] },
    { id: 'history',   name: 'History, biographies & geography', subs: ['History', 'Biographies', 'Geography'] },
    { id: 'language',  name: 'Languages, poetry & regional literature', subs: ['Language learning', 'Poetry', 'Regional literature'] },
    { id: 'religion',  name: 'Religion & philosophy', subs: ['Religion', 'Philosophy', 'Ethics'] },
    { id: 'arts',      name: 'Arts, culture & hobbies', subs: ['Art & design', 'Music', 'Cooking', 'Photography'] },
    { id: 'periodical',name: 'Magazines, journals & periodicals', subs: ['Magazines', 'Academic journals', 'Newspapers'] },
    { id: 'children',  name: "Children's books", subs: ['Picture books', 'Story books'] },
    { id: 'other',     name: 'Other / uncategorized', subs: [] }
  ],
  locations: ['Demo Central Library - Ground Floor', 'Demo Central Library - First Floor', 'Demo Periodicals Section', 'Demo Block E Reading Room'],
  books: (function () {
    var G = 'Demo Central Library - Ground Floor', F = 'Demo Central Library - First Floor', P = 'Demo Periodicals Section', E = 'Demo Block E Reading Room', n = 0;
    function B(title, author, cat, sub, lang, year, kw, copies) {
      n++; var id = 'D' + String(n).padStart(4, '0');
      return { id: id, title: title, author: author, isbn: 'DEMO-' + id.slice(1), category: cat, sub: sub, lang: lang, year: year, keywords: kw,
        copies: copies.map(function (c, i) { return { id: id + '-C' + (i + 1), loc: c[0], status: c[1] === 'a' ? 'available' : 'borrowed', due: c[2] || null }; }) };
    }
    return [
      B('Foundations of Engineering Mathematics (Demo)', 'A. Verma', 'academic', 'Textbooks', 'English', 2021, ['calculus', 'matrices', 'syllabus'], [[G, 'a'], [G, 'b', '2026-11-04'], [F, 'a']]),
      B('Concise Dictionary of Science (Demo)', 'M. Kapoor', 'academic', 'Dictionaries', 'English', 2019, ['glossary', 'terms'], [[G, 'a']]),
      B('The River Between Hills (Demo)', 'S. Narang', 'fiction', 'Novels', 'English', 2018, ['family', 'village', 'drama'], [[F, 'a'], [F, 'b', '2026-11-10']]),
      B('Short Tales of a Small Town (Demo)', 'P. Bedi', 'fiction', 'Short stories', 'English', 2020, ['town', 'stories'], [[F, 'b', null]]),
      B('Everyday Science for Curious Minds (Demo)', 'R. Iyer', 'nonfic', 'General knowledge', 'English', 2022, ['facts', 'quiz', 'trivia'], [[G, 'a'], [G, 'a']]),
      B('Habits That Stick (Demo)', 'N. Chopra', 'selfhelp', 'Productivity', 'English', 2020, ['habits', 'discipline', 'time'], [[F, 'a'], [F, 'b', '2026-11-02']]),
      B('Understanding the Mind (Demo)', 'D. Sethi', 'selfhelp', 'Psychology', 'English', 2017, ['behaviour', 'memory', 'emotion'], [[G, 'a']]),
      B('Placement Aptitude Practice Workbook (Demo)', 'K. Malhotra', 'exams', 'Aptitude', 'English', 2023, ['placement', 'quant', 'reasoning'], [[G, 'b', '2026-11-06'], [G, 'b', '2026-11-12'], [E, 'a']]),
      B('Interview Skills for Graduates (Demo)', 'T. Bhatia', 'exams', 'Interview preparation', 'English', 2022, ['hr round', 'resume', 'placement'], [[E, 'a']]),
      B('General Studies Practice Papers (Demo)', 'L. Gill', 'exams', 'Government exams', 'Hindi', 2021, ['civil services', 'mock test'], [[G, 'a'], [G, 'b', null]]),
      B('Programming Basics with Python (Demo)', 'V. Rao', 'cs', 'Programming', 'English', 2023, ['python', 'beginner', 'coding'], [[F, 'a'], [F, 'a'], [F, 'b', '2026-11-08']]),
      B('Data Structures Made Clear (Demo)', 'J. Menon', 'cs', 'Data structures & algorithms', 'English', 2022, ['trees', 'graphs', 'sorting', 'dsa'], [[F, 'b', '2026-11-03'], [E, 'a']]),
      B('Introduction to Machine Learning (Demo)', 'S. Arora', 'cs', 'AI & data science', 'English', 2024, ['ai', 'models', 'data'], [[F, 'a']]),
      B('Principles of Management (Demo)', 'H. Dhillon', 'business', 'Management', 'English', 2020, ['leadership', 'planning'], [[G, 'a'], [G, 'b', '2026-11-09']]),
      B('Microeconomics Explained (Demo)', 'G. Sandhu', 'business', 'Economics', 'English', 2019, ['demand', 'supply', 'markets'], [[G, 'a']]),
      B('Basic Physics Problems (Demo)', 'C. Joshi', 'science', 'Physics', 'English', 2018, ['mechanics', 'optics', 'numericals'], [[G, 'a'], [G, 'a']]),
      B('Linear Algebra Essentials (Demo)', 'U. Thakur', 'science', 'Mathematics', 'English', 2021, ['vectors', 'matrices'], [[F, 'b', '2026-11-05']]),
      B('A Short History of Trade Routes (Demo)', 'Q. Ahuja', 'history', 'History', 'English', 2016, ['trade', 'ancient', 'maps'], [[G, 'a']]),
      B('Lives of Great Scientists (Demo)', 'B. Saini', 'history', 'Biographies', 'English', 2015, ['biography', 'inventors'], [[F, 'a']]),
      B('Poems of the Monsoon (Demo)', 'I. Kaur', 'language', 'Poetry', 'Punjabi', 2014, ['verse', 'seasons'], [[F, 'a']]),
      B('Spoken English in 30 Days (Demo)', 'O. Gupta', 'language', 'Language learning', 'English', 2020, ['speaking', 'grammar'], [[G, 'a'], [G, 'b', '2026-11-07']]),
      B('Questions of Ethics (Demo)', 'W. Dutta', 'religion', 'Ethics', 'English', 2019, ['morality', 'philosophy'], [[G, 'a']]),
      B('Introduction to Photography (Demo)', 'Z. Anand', 'arts', 'Photography', 'English', 2022, ['camera', 'light', 'hobby'], [[F, 'a'], [F, 'b', '2026-11-11']]),
      B('Campus Science Monthly - Sample Issue (Demo)', 'Editorial team', 'periodical', 'Magazines', 'English', 2026, ['magazine', 'issue', 'monthly'], [[P, 'a']]),
      B('Journal of Applied Computing - Sample Volume (Demo)', 'Editorial board', 'periodical', 'Academic journals', 'English', 2025, ['journal', 'research', 'volume'], [[P, 'a'], [P, 'b', null]]),
      B('Unsorted Pamphlet Collection (Demo)', 'Various', 'unlisted-category', '', 'English', 2012, ['pamphlets', 'misc'], [[G, 'a']])
    ];
  })()
};
