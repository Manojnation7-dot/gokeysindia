import React from 'react';

export default function TourPDFContent({ tourData, documentNumber, currentDate,baseUrl,tourPath}) {
  const companyInfo = {
    name: 'GoKeys India',
    email: 'helpdesk@gokeys.in',
    phone: '+91-7830718687',
    address: 'Near Bus Stand, Haridwar Uttarakhand',
    logo: '/images/gokeyslogo.png',
    externalLogo: 'https://gokeysindia.com/uploads/gokeyslogo.png',
  };

 const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gokeys.in";

 const tourUrl = `${siteUrl}/${tourPath}/${tourData.slug}`;

  if (!tourData) {
    return <div style={{ color: '#000000', fontSize: '10pt', padding: '20mm' }}>No tour data available</div>;
  }

  const title = tourData.name || 'Unnamed Tour';
  const duration = tourData.duration
  ? `${tourData.duration} Days`
  : (tourData.duration_days && tourData.duration_nights
      ? `${tourData.duration_days} Days, ${tourData.duration_nights} Nights`
      : 'Duration not specified'
    );
  const itinerary = Array.isArray(tourData.itineraries)
    ? tourData.itineraries.map(item =>
        `${item.title || `Day ${item.day || 'N/A'}`}${item.description ? `: ${item.description.replace(/<[^>]+>/g, '').trim()}` : ''}`
      )
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
        price: p.discount_price || p.price || 'N/A',
      }))
    : [];

  const highlights = Array.isArray(tourData.highlights) ? tourData.highlights.map(h => h.highlight) : [];

  const inclusionIcons = {
    flights: '✈️',
    accommodation: '🏨',
    meals: '🍽️',
    transportation: '🚐',
    sightseeing: '🏞️',
    guide: '👤',
  };

  const getInclusionIcon = desc => {
    const d = desc.toLowerCase();
    for (const [key, icon] of Object.entries(inclusionIcons)) {
      if (d.includes(key)) return icon;
    }
    return '✓';
  };

  const headerInclusions = inclusions.slice(0, 4).map(inc => ({
    text: inc,
    icon: getInclusionIcon(inc),
  }));

  
  return (
    <div
      id="pdf-tour-content"
      style={{
        margin: 0, // prevent default spacing
        padding: '20mm',
        paddingTop: '5mm', // reduced paddingTop
        fontSize: '10pt',
        color: '#333',
        fontFamily: "'Arial', sans-serif",
        backgroundColor: '#fff',
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
        position: 'relative',
        lineHeight: '1.5',
        overflowWrap: 'break-word',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '0mm', // eliminate top spacing
          marginBottom: '5mm',
          paddingBottom: '3mm',
          borderBottom: '1px solid #E5E7EB',
          position: 'relative',
          zIndex: '10',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={companyInfo.logo}
            alt={`${companyInfo.name} Logo`}
            style={{
              maxWidth: '50mm',
              maxHeight: '12mm',
              objectFit: 'contain',
              marginBottom: '1mm',
              marginTop: '0mm',
            }}
            onError={e => {
              console.error('Logo failed to load:', companyInfo.logo);
              e.target.src = '/images/placeholder-logo.png';
            }}
          />
          <div>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#2563EB', textAlign: 'center' }}>
              {companyInfo.name}
            </div>
            <div style={{ fontSize: '7pt', color: '#666', marginTop: '1mm' }}>Your Journey Begins Here</div>
            <div style={{ fontSize: '7pt', color: '#666', marginTop: '1mm' }}>
              {companyInfo.email} | {companyInfo.phone}
            </div>
            <div style={{ fontSize: '7pt', color: '#666', marginTop: '1mm' }}>{companyInfo.address}</div>
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
        <h1
          style={{
            fontSize: '18pt',
            fontWeight: 'bold',
            margin: '0 0 3mm 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5mm',
            maxWidth: '170mm',
            wordWrap: 'break-word',
          }}
        >
          {title}
        </h1>
        <div style={{ fontSize: '12pt', marginBottom: '3mm', fontWeight: '500' }}>{duration}</div>
        {headerInclusions.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '5mm',
              fontSize: '8pt',
              opacity: '0.9',
              flexWrap: 'wrap',
            }}
          >
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
      <div
        style={{
          marginBottom: '10mm',
          textAlign: 'center',
          pageBreakInside: 'avoid',
        }}
      >
        <img
          src={tourData.featured_image?.optimized_banner || tourData.featured_image?.image || '/images/banner-image.png'}
          alt="Featured Image"
          style={{
            width: '170mm', // Full content width (210mm - 20mm padding each side)
            maxHeight: '80mm', // Limit height to avoid overflow
            objectFit: 'cover',
            borderRadius: '3mm',
            boxShadow: '0 2mm 3mm rgba(0,0,0,0.1)',
            display: 'block',
            margin: '0 auto', // Ensure centering
          }}
          onError={(e) => {
            console.error('Featured image failed to load:', e.target.src);
            e.target.src = '/images/banner-image.png'; // Fallback to placeholder
          }}
        />
      </div>

      {/* Highlights */}
      <div
        style={{
          marginBottom: '10mm',
          border: '0.5mm solid #E5E7EB',
          borderRadius: '3mm',
          padding: '5mm',
          backgroundColor: '#F9FAFB',
          pageBreakInside: 'avoid',
        }}
      >
        <h2
          style={{
            fontSize: '12pt',
            fontWeight: '600',
            color: '#2563EB',
            marginBottom: '3mm',
            borderBottom: '1mm solid #2563EB',
            paddingBottom: '2mm',
            display: 'inline-block',
          }}
        >
          Highlights
        </h2>
        {highlights.length ? (
          <ul
            style={{
              listStyleType: 'none',
              padding: '0',
              margin: '0',
              maxWidth: '170mm',
            }}
          >
            {highlights.map((highlight, i) => (
              <li
                key={i}
                style={{
                  marginBottom: '2mm',
                  paddingLeft: '5mm',
                  position: 'relative',
                  lineHeight: '1.5',
                  wordWrap: 'break-word',
                }}
              >
                <span style={{ position: 'absolute', left: '0', color: '#2563EB' }}>•</span>
                {highlight || 'No details'}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666666', fontStyle: 'italic' }}>No highlights available</p>
        )}
      </div>

      {/* Itinerary */}
      <div style={{ marginLeft: '3mm' }}>
        {itinerary.map((day, i) => (
          <div
            key={i}
            style={{
              marginBottom: '5mm',
              paddingBottom: '5mm',
              borderBottom: i < itinerary.length - 1 ? '0.3mm dashed #E5E7EB' : 'none',
              pageBreakInside: 'avoid',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3mm' }}>
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
                  textAlign: 'center',
                  lineHeight: '1.2',
                  position: 'relative',
                  top: '-0.3mm', // Push slightly up to visually center
                }}
              >
                {i + 1}
              </div>
              <div style={{ maxWidth: '160mm' }}>
                <h3
                  style={{
                    fontSize: '10pt',
                    fontWeight: '600',
                    color: '#2563EB',
                    margin: '0 0 2mm 0',
                    wordWrap: 'break-word',
                  }}
                >
                  {day.split(':')[0] || `Day ${i + 1}`}
                </h3>
                <p
                  style={{
                    color: '#4B5563',
                    lineHeight: '1.5',
                    margin: '0',
                    wordWrap: 'break-word',
                  }}
                >
                  {day.split(':')[1]?.trim() || 'No details'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inclusions & Exclusions */}
      <div
        style={{
          display: 'flex',
          gap: '5mm',
          marginBottom: '10mm',
          pageBreakInside: 'avoid',
        }}
      >
        {/* Inclusions */}
        <div
          style={{
            flex: '1',
            border: '0.5mm solid #E5E7EB',
            borderRadius: '3mm',
            padding: '5mm',
            backgroundColor: '#F9FAFB',
          }}
        >
          <h2
            style={{
              fontSize: '12pt',
              fontWeight: '600',
              color: '#2563EB',
              marginBottom: '5mm',
              borderBottom: '1mm solid #2563EB',
              paddingBottom: '2mm',
              display: 'inline-block',
            }}
          >
            Inclusions
          </h2>
          {inclusions.length ? (
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0', maxWidth: '80mm' }}>
              {inclusions.map((inc, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: '2mm',
                    paddingLeft: '5mm',
                    position: 'relative',
                    lineHeight: '1.5',
                    wordWrap: 'break-word',
                  }}
                >
                  <span style={{ position: 'absolute', left: '0', color: '#2563EB' }}>✓</span>
                  {inc || 'No details'}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666666', fontStyle: 'italic' }}>No inclusions available</p>
          )}
        </div>

        {/* Exclusions */}
        <div
          style={{
            flex: '1',
            border: '0.5mm solid #E5E7EB',
            borderRadius: '3mm',
            padding: '5mm',
            backgroundColor: '#F9FAFB',
          }}
        >
          <h2
            style={{
              fontSize: '12pt',
              fontWeight: '600',
              color: '#FF6B6B',
              marginBottom: '5mm',
              borderBottom: '1mm solid #FF6B6B',
              paddingBottom: '2mm',
              display: 'inline-block',
            }}
          >
            Exclusions
          </h2>
          {exclusions.length ? (
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0', maxWidth: '80mm' }}>
              {exclusions.map((exc, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: '2mm',
                    paddingLeft: '5mm',
                    position: 'relative',
                    lineHeight: '1.5',
                    wordWrap: 'break-word',
                  }}
                >
                  <span style={{ position: 'absolute', left: '0', color: '#FF6B6B' }}>✗</span>
                  {exc || 'No details'}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666666', fontStyle: 'italic' }}>No exclusions available</p>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div
        style={{
          marginBottom: '10mm',
          border: '0.5mm solid #E5E7EB',
          borderRadius: '3mm',
          padding: '5mm',
          pageBreakInside: 'avoid',
        }}
      >
        <h2
          style={{
            fontSize: '12pt',
            fontWeight: '600',
            color: '#2563EB',
            marginBottom: '5mm',
            borderBottom: '1mm solid #2563EB',
            paddingBottom: '2mm',
            display: 'inline-block',
          }}
        >
          Pricing
        </h2>
        {pricing.length ? (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#FFFFFF',
              borderRadius: '2mm',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                <th
                  style={{
                    padding: '3mm',
                    fontWeight: '600',
                    textAlign: 'left',
                    fontSize: '9pt',
                  }}
                >
                  Package Type
                </th>
                <th
                  style={{
                    padding: '3mm',
                    fontWeight: '600',
                    textAlign: 'right',
                    fontSize: '9pt',
                  }}
                >
                  Price Per Person
                </th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((p, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                    borderBottom: '0.3mm solid #E5E7EB',
                  }}
                >
                  <td
                    style={{
                      padding: '3mm',
                      color: '#333333',
                      fontWeight: '500',
                      fontSize: '9pt',
                      wordWrap: 'break-word',
                      maxWidth: '100mm',
                    }}
                  >
                    {p.type}
                  </td>
                  <td
                    style={{
                      padding: '3mm',
                      color: '#333333',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: '9pt',
                    }}
                  >
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#666666', fontStyle: 'italic' }}>No pricing available</p>
        )}
      </div>

      {/* More Details Link */}
      <div
        style={{
          marginBottom: '15mm',
          textAlign: 'center',
          fontSize: '10pt',
          color: '#2563EB',
          pageBreakInside: 'avoid',
        }}
      >
        <a
          href={tourUrl}
          style={{
            color: '#2563EB',
            textDecoration: 'none',
            wordWrap: 'break-word',
            maxWidth: '170mm',
            display: 'inline-block',
          }}
        >
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