function classNames(classesObj, classesStr) {
  let classes = classesStr && typeof classesStr === 'string' ? [classesStr] : [];

  if (classesObj && typeof classesObj === 'object') {
    const convertedClasses = Object.entries(classesObj)
      .reduce((acm, classItem) => {
        if (classItem[1]) {
          return [...acm, classItem[0]];
        }
        return acm;
      }, []);
      classes.push(...convertedClasses);
  }

  return classes.join(' ');
}

export default classNames;
