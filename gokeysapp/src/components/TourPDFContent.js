import React from 'react';

// Generates a random alphanumeric string
const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

export default function TourPDFContent({ tourData, baseUrl, tourPath }) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');

  // Generate a document number based on the tour slug and a random string
  const documentNumber = `GK-${(tourData.slug ?? '').substring(0, 4).toUpperCase()}-${generateRandomString(6)}`;

  const companyInfo = {
    name: 'GoKeys India',
    email: 'helpdesk@gokeys.in',
    phone: '+91-7830718687',
    address: 'Near Bus Stand, Haridwar, Uttarakhand',
    logo: '/images/gokeyslogo.png',
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gokeys.in";
  const tourUrl = `${siteUrl}/${tourPath}/${tourData.slug}`;

  if (!tourData) {
    return <div style={{ color: '#000000', fontSize: '10pt', padding: '20mm' }}>No tour data available</div>;
  }

  const title = tourData.name ?? 'Unnamed Tour';
  const duration = tourData.duration
    ? `${tourData.duration} Days`
    : (tourData.duration_days && tourData.duration_nights
        ? `${tourData.duration_days} Days, ${tourData.duration_nights} Nights`
        : 'Duration not specified'
      );

  const formatDescription = (description) => {
  const desc = description?.replace(/<[^>]+>/g, '').trim() ?? 'No details';
  const lines = desc.split(/\n/);

  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return null;

    // Check if the line is a bullet point
    const isBullet = /^(-|\*|•)\s+/.test(trimmed);
    if (isBullet) {
      return (
        <li key={i} style={{ position: 'relative', paddingLeft: '4mm', marginBottom: '2mm', listStyle: 'none' }}>
          <span style={{ position: 'absolute', left: 0, top: '1mm', color: '#2563EB', fontSize: '10pt' }}>•</span>
          {trimmed.replace(/^(-|\*|•)\s+/, '')}
        </li>
      );
    } else {
      return (
        <p key={i} style={{ margin: '0 0 2mm 0', wordWrap: 'break-word', fontSize: '10pt' }}>
          {trimmed}
        </p>
      );
    }
  }).filter(Boolean); // remove empty lines
};

  const itinerary = Array.isArray(tourData.itineraries)
  ? tourData.itineraries.map(item => {
      const formattedDesc = formatDescription(item.description);
      const hasBullet = formattedDesc.some(el => el.type === 'li');

      return {
        title: item.title ?? `Day ${item.day ?? 'N/A'}`,
        description: hasBullet ? <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>{formattedDesc}</ul> : formattedDesc
      };
    })
  : [];

  const inclusions = Array.isArray(tourData.inclusions_exclusions)
    ? tourData.inclusions_exclusions.filter(i => i.is_inclusion).map(i => i.description)
    : [];

  const exclusions = Array.isArray(tourData.inclusions_exclusions)
    ? tourData.inclusions_exclusions.filter(i => !i.is_inclusion).map(i => i.description)
    : [];

  const pricing = Array.isArray(tourData.pricing)
    ? tourData.pricing.map(p => ({
        type: p.package_type ? p.package_type.charAt(0).toUpperCase() + p.package_type.slice(1) : 'N/A',
        price: p.discount_price ?? p.price ?? 'N/A',
      }))
    : [];

  const highlights = Array.isArray(tourData.highlights) ? tourData.highlights.map(h => h.highlight) : [];

  const getInclusionIcon = desc => {
    const inclusionIcons = {
      flights: '✈️',
      accommodation: '🏨',
      meals: '🍽️',
      transportation: '🚐',
      sightseeing: '🏞️',
      guide: '👤',
    };
    const d = desc?.toLowerCase() ?? '';
    for (const [key, icon] of Object.entries(inclusionIcons)) {
      if (d.includes(key)) return icon;
    }
    return '✓';
  };

  const headerInclusions = inclusions.slice(0, 4).map(inc => ({
    text: inc,
    icon: getInclusionIcon(inc),
  }));

  const mainContainerStyle = {
    margin: '0 auto',
    padding: '20mm',
    paddingTop: '15mm',
    fontSize: '10pt',
    color: '#333',
    fontFamily: "'Arial', sans-serif",
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '210mm',
    minHeight: '297mm',
    boxSizing: 'border-box',
    position: 'relative',
    lineHeight: '1.5',
  };

  const sectionStyle = {
    marginBottom: '10mm',
    border: '0.5mm solid #E5E7EB',
    borderRadius: '3mm',
    padding: '5mm',
    backgroundColor: '#F9FAFB',
    pageBreakInside: 'avoid',
  };

  const headingStyle = (color = '#2563EB') => ({
    fontSize: '12pt',
    fontWeight: '600',
    color,
    marginBottom: '5mm',
    borderBottom: `1mm solid ${color}`,
    paddingBottom: '2mm',
    display: 'inline-block',
  });

  const itinerarySectionStyle = {
    marginBottom: '10mm',
    pageBreakInside: 'avoid',
  };

  const listItemStyle = {
    marginBottom: '2mm',
    paddingLeft: '5mm',
    position: 'relative',
    lineHeight: '1.5',
    wordWrap: 'break-word',
  };

  const listItemMarkerStyle = (color) => ({
    position: 'absolute',
    left: '0',
    color,
    fontWeight: 'bold',
  });

  return (
    <div id="pdf-tour-content" style={mainContainerStyle}>
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '5mm',
          paddingBottom: '3mm',
          borderBottom: '1px solid #E5E7EB',
          position: 'relative',
          zIndex: '10',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={companyInfo.logo}
            alt={`${companyInfo.name} Logo`}
            style={{
              maxWidth: '50mm',
              maxHeight: '12mm',
              objectFit: 'contain',
              marginBottom: '1mm',
            }}
            onError={e => {
              console.error('Logo failed to load:', companyInfo.logo);
              e.target.src = '/images/placeholder-logo.png';
            }}
          />
          <div>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#2563EB' }}>
              {companyInfo.name}
            </div>
            <div style={{ fontSize: '7pt', color: '#666', marginTop: '1mm' }}>{companyInfo.email} | {companyInfo.phone} | {companyInfo.address}</div>
            <div style={{ fontSize: '7pt', color: '#666', marginTop: '1mm' }}>
              Document No: {documentNumber} | Date: {currentDate}
            </div>
          </div>
        </div>
      </div>

      {/* Tour Header */}
      <div
        style={{
          background: 'linear-gradient(to right, #2563EB, #3B82F6)',
          padding: '10mm',
          borderRadius: '4mm',
          color: '#FFFFFF',
          marginBottom: '10mm',
          textAlign: 'center',
          boxShadow: '0 2mm 3mm rgba(0,0,0,0.1)',
          pageBreakInside: 'avoid',
        }}
      >
        <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: '0 0 3mm 0', textTransform: 'uppercase', letterSpacing: '0.5mm' }}>
          {title}
        </h1>
        <div style={{ fontSize: '12pt', marginBottom: '3mm', fontWeight: '500' }}>{duration}</div>
        {headerInclusions.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '5mm', fontSize: '8pt', opacity: '0.9', flexWrap: 'wrap' }}>
            {headerInclusions.map((inc, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '1mm' }}>
                <span>{inc.icon}</span>
                <span>{inc.text}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Featured Image */}
      <div style={{ marginBottom: '10mm', textAlign: 'center', pageBreakInside: 'avoid' }}>
        <img
          src={tourData.featured_image?.optimized_banner || tourData.featured_image?.image || '/images/banner-image.png'}
          alt="Featured Tour Image"
          style={{ width: '100%', maxWidth: '170mm', maxHeight: '80mm', objectFit: 'cover', borderRadius: '3mm', boxShadow: '0 2mm 3mm rgba(0,0,0,0.1)' }}
          onError={(e) => {
            console.error('Featured image failed to load:', e.target.src);
            e.target.src = '/images/banner-image.png';
          }}
        />
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={headingStyle()}>Highlights</h2>
          <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
            {highlights.map((highlight, i) => (
              <li key={i} style={listItemStyle}>
                <span style={listItemMarkerStyle('#2563EB')}>•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Itinerary */}
      {itinerary.length > 0 && (
        <div style={itinerarySectionStyle}>
          <h2 style={headingStyle()}>Itinerary</h2>
          {itinerary.map((day, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '3mm',
                marginBottom: '5mm',
                paddingBottom: '5mm',
                borderBottom: i < itinerary.length - 1 ? '0.3mm dashed #E5E7EB' : 'none',
                pageBreakInside: 'avoid',
              }}
            >
              <div
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  width: '6mm',
                  height: '6mm',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: '0',
                  fontSize: '8pt',
                  fontWeight: 'bold',
                }}
              >
                {i + 1}
              </div>
              <div>
                <h3 style={{ fontSize: '10pt', fontWeight: '600', color: '#2563EB', margin: '0 0 2mm 0' }}>{day.title}</h3>
                {day.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inclusions & Exclusions */}
      <div style={{ display: 'flex', gap: '5mm', marginBottom: '10mm', pageBreakInside: 'avoid' }}>
        {inclusions.length > 0 && (
          <div style={sectionStyle}>
            <h2 style={headingStyle()}>Inclusions</h2>
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              {inclusions.map((inc, i) => (
                <li key={i} style={listItemStyle}>
                  <span style={listItemMarkerStyle('#2563EB')}>✓</span>
                  {inc}
                </li>
              ))}
            </ul>
          </div>
        )}
        {exclusions.length > 0 && (
          <div style={sectionStyle}>
            <h2 style={headingStyle('#FF6B6B')}>Exclusions</h2>
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              {exclusions.map((exc, i) => (
                <li key={i} style={listItemStyle}>
                  <span style={listItemMarkerStyle('#FF6B6B')}>✗</span>
                  {exc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Pricing */}
      {pricing.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={headingStyle()}>Pricing</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFFFFF', borderRadius: '2mm', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                <th style={{ padding: '3mm', fontWeight: '600', textAlign: 'left', fontSize: '9pt' }}>Package Type</th>
                <th style={{ padding: '3mm', fontWeight: '600', textAlign: 'right', fontSize: '9pt' }}>Price Per Person</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((p, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottom: '0.3mm solid #E5E7EB' }}>
                  <td style={{ padding: '3mm', color: '#333333', fontWeight: '500', fontSize: '9pt', wordWrap: 'break-word', maxWidth: '100mm' }}>{p.type}</td>
                  <td style={{ padding: '3mm', color: '#333333', textAlign: 'right', fontWeight: 'bold', fontSize: '9pt' }}>
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* More Details Link */}
      <div style={{ marginBottom: '15mm', textAlign: 'center', fontSize: '10pt', color: '#2563EB', pageBreakInside: 'avoid' }}>
        <a href={tourUrl} style={{ color: '#2563EB', textDecoration: 'none' }}>
          For more details, visit our website: {tourUrl}
        </a>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '10mm',
          left: '20mm',
          right: '20mm',
          borderTop: '0.5mm solid #E5E7EB',
          paddingTop: '3mm',
          textAlign: 'center',
          fontSize: '8pt',
          color: '#666666',
        }}
      >
        <div style={{ marginBottom: '2mm' }}>
          <strong>{companyInfo.name}</strong> |{' '}
          <a href={`mailto:${companyInfo.email}`} style={{ color: '#2563EB' }}>
            {companyInfo.email}
          </a>{' '}
          | {companyInfo.phone}
        </div>
        <div>{companyInfo.address}</div>
        <div style={{ marginTop: '2mm' }}>
          Page <span className="pageNumber"></span> of <span className="totalPages"></span>
        </div>
      </div>
    </div>
  );
}