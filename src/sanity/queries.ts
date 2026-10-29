import { defineQuery } from "next-sanity";

export const COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    coverImage,
    popular,
    studentCount,
    price,
    "moduleCount": count(modules),
    "durationSeconds": math::sum(modules[].lessons[]->durationSeconds)
  }
`);

export const COURSE_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    coverImage,
    popular,
    studentCount,
    price,
    "moduleCount": count(modules),
    "durationSeconds": math::sum(modules[].lessons[]->durationSeconds),
    learningOutcomes[] { _key, icon, title, description },
    instructor-> { name, "slug": slug.current, photo, expertise },
    category-> { title, "slug": slug.current },
    modules[] {
      _key,
      title,
      summary,
      "durationSeconds": math::sum(lessons[]->durationSeconds),
      "lessons": lessons[]-> { _id, title, "slug": slug.current, durationSeconds, freePreview }
    }
  }
`);

export const LESSON_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    videoUrl,
    poster,
    durationSeconds,
    freePreview,
    studentCount,
    notes,
    keyPoints,
    proTip,
    resources[] { _key, type, title, description, url },
    "course": *[_type == "course" && references(^._id)][0] {
      title,
      "slug": slug.current,
      level,
      coverImage,
      instructor-> { name, "slug": slug.current, photo, expertise },
      modules[] {
        _key,
        title,
        "lessons": lessons[]-> { _id, title, "slug": slug.current, durationSeconds }
      }
    }
  }
`);

export const INSTRUCTOR_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      level,
      coverImage,
      "moduleCount": count(modules),
      "durationSeconds": math::sum(modules[].lessons[]->durationSeconds)
    }
  }
`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] { "slug": slug.current }
`);

export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)] { "slug": slug.current }
`);
