(function () {
  const data = window.siteData;

  if (!data) {
    throw new Error("siteData is missing. Load site-data.js before site.js.");
  }

  const toggleSection = (sectionId, visible) => {
    const section = document.getElementById(sectionId);
    if (section) section.hidden = !visible;

    const navLink = document.querySelector(`.section-nav a[href="#${sectionId}"]`);
    if (navLink) navLink.hidden = !visible;
  };

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (value) {
      el.textContent = value;
      el.hidden = false;
      return;
    }

    el.hidden = true;
  };

  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = html;
    el.hidden = !html;
  };

  const createBullet = (text) => {
    const p = document.createElement("p");
    p.className = "bullet-item";
    p.textContent = text;
    return p;
  };

  const renderTimeline = (tableId, items) => {
    const table = document.getElementById(tableId);
    if (!table) return;

    table.innerHTML = "";

    if (!items || !items.length) {
      return;
    }

    items.forEach((item) => {
      const row = document.createElement("tr");

      const period = document.createElement("td");
      period.className = "timeline-date";
      period.textContent = item.period;

      const detail = document.createElement("td");
      detail.className = "timeline-detail";
      detail.textContent = item.detail;

      row.append(period, detail);
      table.appendChild(row);
    });
  };

  const renderPublications = (listId, items) => {
    const list = document.getElementById(listId);
    if (!list) return;

    list.innerHTML = "";

    if (!items || !items.length) {
      list.hidden = true;
      return;
    }

    const sortedItems = [...items].sort((left, right) => getPublicationYear(right) - getPublicationYear(left));

    sortedItems.forEach((item) => {
      const li = document.createElement("li");
      li.className = "publication-item";

      const authors = document.createElement("span");
      authors.className = "author-list";
      authors.innerHTML = formatAuthors(item.authors);

      const title = document.createElement("span");
      title.className = "paper-title";
      title.textContent = item.title;

      const venue = document.createElement("span");
      venue.className = "paper-venue";
      venue.textContent = formatVenue(item);
      if (item.highlight) venue.classList.add("is-highlight");

      li.append(authors, title, venue);

      if (item.details) {
        const details = document.createElement("span");
        details.className = "paper-details";
        details.textContent = item.details;
        li.appendChild(details);
      }

      let links = [
        ["pdf", "PDF"],
        ["code", "Code"],
        ["project", "Project"],
        ["dataset", "Dataset"],
        ["slides", "Slides"],
        ["doi", "DOI"]
      ].filter(([key]) => item[key]);

      if (!links.length && data.meta?.previewMissingLinks) {
        links = [
          ["pdf", "PDF"],
          ["code", "Code"]
        ];
      }

      if (links.length) {
        const linkWrap = document.createElement("span");
        linkWrap.className = "paper-links";

        links.forEach(([key, label]) => {
          const link = document.createElement("a");
          link.textContent = label;

          if (item[key]) {
            link.href = item[key];
            link.target = "_blank";
            link.rel = "noreferrer noopener";
          } else {
            link.href = "#";
            link.classList.add("is-disabled");
            link.setAttribute("aria-disabled", "true");
            link.title = `${label} link not added yet`;
          }

          linkWrap.appendChild(link);
        });

        li.appendChild(linkWrap);
      }

      list.appendChild(li);
    });
  };

  const renderYearTable = (tableId, items) => {
    const table = document.getElementById(tableId);
    if (!table) return;

    table.innerHTML = "";

    if (!items || !items.length) {
      return;
    }

    items.forEach((item) => {
      const row = document.createElement("tr");

      const year = document.createElement("td");
      year.className = "year-cell";
      year.textContent = item.year;

      const title = document.createElement("td");
      title.textContent = item.title;

      row.append(year, title);
      table.appendChild(row);
    });
  };

  const renderBulletGroup = (containerId, items) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (!items || !items.length) {
      return;
    }

    items.forEach((item) => container.appendChild(createBullet(item)));
  };

  const renderStudents = (containerId, items) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (!items || !items.length) {
      return;
    }

    items.forEach((item) => container.appendChild(createBullet(item)));
  };

  const renderProfile = () => {
    document.title = data.meta?.pageTitle || document.title;

    const description = document.querySelector('meta[name="description"]');
    if (description && data.meta?.description) {
      description.content = data.meta.description;
    }

    setText("profile-name-en", data.profile?.nameEn);
    setText("profile-name-zh", data.profile?.nameZh);
    setText("profile-title", data.profile?.title);
    setText("profile-affiliation-1", data.profile?.affiliationLine1);
    setText("profile-affiliation-2", data.profile?.affiliationLine2);
    setText("profile-phone", data.profile?.phone);
    setText("profile-email", data.profile?.email);

    const addressEl = document.getElementById("profile-address");
    addressEl.innerHTML = "";
    (data.profile?.addressLines || []).forEach((line) => {
      const p = document.createElement("p");
      p.textContent = line;
      addressEl.appendChild(p);
    });
    addressEl.hidden = !addressEl.childElementCount;

    const altLink = document.getElementById("profile-alt-link");
    if (data.meta?.altLink?.href && data.meta.altLink.href !== "#") {
      altLink.href = data.meta.altLink.href;
      altLink.textContent = data.meta.altLink.label || "Alternate page";
    } else {
      altLink.hidden = true;
    }

    const profileLinks = document.getElementById("profile-links");
    profileLinks.innerHTML = "";
    (data.profile?.links || [])
      .filter((item) => item.href && item.href !== "#")
      .forEach((item) => {
        const link = document.createElement("a");
        link.href = item.href;
        link.target = "_blank";
        link.rel = "noreferrer noopener";
        link.textContent = item.label;
        profileLinks.appendChild(link);
      });
    profileLinks.hidden = !profileLinks.childElementCount;

    const photo = document.getElementById("profile-photo");
    const fallback = document.getElementById("profile-photo-fallback");
    if (data.profile?.avatar) {
      photo.src = data.profile.avatar;
      photo.hidden = false;
      fallback.style.display = "none";
      photo.onerror = () => {
        photo.hidden = true;
        fallback.textContent = "Your Photo";
        fallback.style.display = "flex";
      };
      return;
    }

    photo.hidden = true;
    fallback.textContent = "Your Photo";
    fallback.style.display = "flex";
  };

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const formatAuthors = (value) => {
    const selfName = data.profile?.nameEn || "";
    let formatted = escapeHtml(value || "").replaceAll("^", "");

    if (selfName) {
      const escapedName = selfName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      formatted = formatted.replace(
        new RegExp(escapedName, "g"),
        `<span class="self-author">${escapeHtml(selfName)}</span>`
      );
    }

    return formatted.replaceAll("*", "<sup>*</sup>");
  };

  const formatVenue = (item) => {
    if (!item.venueShort) return item.venue;
    return `${item.venue} (${item.venueShort})`;
  };

  const renderBiography = () => {
    setText("bio-en", data.biography?.en);
    setText("bio-zh", data.biography?.zh);
    toggleSection("Biography", Boolean(data.biography?.en || data.biography?.zh));
  };

  const getPublicationYear = (item) => {
    if (typeof item.year === "number") return item.year;

    const matchedYear = String(item.details || item.venue || "").match(/\b(19|20)\d{2}\b/);
    if (matchedYear) return Number(matchedYear[0]);

    return 0;
  };

  const renderResearchInterests = () => {
    const value = Array.isArray(data.researchInterests)
      ? `${data.researchInterests.join(", ")}.`
      : data.researchInterests;
    setText("research-interests", value);
    toggleSection("ResearchInterests", Boolean(value));
  };

  const renderFooter = () => {
    setText("last-updated", data.meta?.lastUpdated || new Date().toISOString().slice(0, 10));
    setText("footer-note", data.meta?.footerNote);
  };

  const renderActivities = () => {
    renderBulletGroup("editorial-list", data.activities?.editorial);
    renderBulletGroup("membership-list", data.activities?.membership);
    setText("program-text", data.activities?.programCommittee);
    setText("reviewer-text", data.activities?.reviewer);

    const hasActivities = Boolean(
      (data.activities?.editorial && data.activities.editorial.length) ||
      (data.activities?.membership && data.activities.membership.length) ||
      data.activities?.programCommittee ||
      data.activities?.reviewer
    );

    toggleSection("ProfessionalActivities", hasActivities);
    document.getElementById("editorial-group").hidden = !(data.activities?.editorial && data.activities.editorial.length);
    document.getElementById("membership-group").hidden = !(data.activities?.membership && data.activities.membership.length);
    document.getElementById("program-group").hidden = !data.activities?.programCommittee;
    document.getElementById("reviewer-group").hidden = !data.activities?.reviewer;
  };

  renderProfile();
  renderBiography();
  renderTimeline("education-table", data.education);
  renderTimeline("experience-table", data.experience);
  toggleSection("Education", Boolean(data.education?.length));
  toggleSection("Experience", Boolean(data.experience?.length));
  renderResearchInterests();
  renderPublications("journal-publications", data.publications?.journals);
  renderPublications("conference-publications", data.publications?.conferences);
  toggleSection(
    "Publications",
    Boolean(data.publications?.journals?.length || data.publications?.conferences?.length)
  );
  renderYearTable("honors-table", data.honors);
  toggleSection("Honors", Boolean(data.honors?.length));
  renderActivities();
  renderStudents("phd-list", data.students?.phd);
  renderStudents("master-list", data.students?.master);
  toggleSection("Students", Boolean(data.students?.phd?.length || data.students?.master?.length));
  document.getElementById("phd-group").hidden = !(data.students?.phd && data.students.phd.length);
  document.getElementById("master-group").hidden = !(data.students?.master && data.students.master.length);
  renderFooter();
})();
