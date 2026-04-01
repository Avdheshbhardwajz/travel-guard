import { useState } from 'react';
import { Search, Phone, Shield, Heart, AlertTriangle, Globe, ChevronDown, ChevronUp } from 'lucide-react';

// Curated emergency directory for 40+ countries
const emergencyData = [
  { country: 'India', code: 'IN', flag: '🇮🇳', police: '100', ambulance: '102', fire: '101', universal: '112', notes: 'Women helpline: 1091, Child helpline: 1098' },
  { country: 'United States', code: 'US', flag: '🇺🇸', police: '911', ambulance: '911', fire: '911', universal: '911', notes: 'Poison control: 1-800-222-1222' },
  { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', police: '999', ambulance: '999', fire: '999', universal: '112', notes: 'Non-emergency police: 101, NHS: 111' },
  { country: 'Canada', code: 'CA', flag: '🇨🇦', police: '911', ambulance: '911', fire: '911', universal: '911', notes: 'Poison control varies by province' },
  { country: 'Australia', code: 'AU', flag: '🇦🇺', police: '000', ambulance: '000', fire: '000', universal: '112', notes: 'From mobiles: 112 also works' },
  { country: 'Germany', code: 'DE', flag: '🇩🇪', police: '110', ambulance: '112', fire: '112', universal: '112', notes: 'Poison: 030 192 40' },
  { country: 'France', code: 'FR', flag: '🇫🇷', police: '17', ambulance: '15', fire: '18', universal: '112', notes: 'SAMU (medical): 15' },
  { country: 'Japan', code: 'JP', flag: '🇯🇵', police: '110', ambulance: '119', fire: '119', universal: '110/119', notes: 'Coast guard: 118' },
  { country: 'China', code: 'CN', flag: '🇨🇳', police: '110', ambulance: '120', fire: '119', universal: '110', notes: 'Traffic accident: 122' },
  { country: 'Brazil', code: 'BR', flag: '🇧🇷', police: '190', ambulance: '192', fire: '193', universal: '190', notes: 'Civil police: 197' },
  { country: 'Thailand', code: 'TH', flag: '🇹🇭', police: '191', ambulance: '1669', fire: '199', universal: '191', notes: 'Tourist police: 1155' },
  { country: 'Singapore', code: 'SG', flag: '🇸🇬', police: '999', ambulance: '995', fire: '995', universal: '999', notes: 'Non-emergency: 1800-255-0000' },
  { country: 'UAE', code: 'AE', flag: '🇦🇪', police: '999', ambulance: '998', fire: '997', universal: '999', notes: 'Tourist security: 800 2626' },
  { country: 'Italy', code: 'IT', flag: '🇮🇹', police: '113', ambulance: '118', fire: '115', universal: '112', notes: 'Carabinieri: 112' },
  { country: 'Spain', code: 'ES', flag: '🇪🇸', police: '091', ambulance: '061', fire: '080', universal: '112', notes: 'Guardia Civil: 062' },
  { country: 'South Korea', code: 'KR', flag: '🇰🇷', police: '112', ambulance: '119', fire: '119', universal: '112', notes: 'Foreigner helpline: 1345' },
  { country: 'Mexico', code: 'MX', flag: '🇲🇽', police: '911', ambulance: '911', fire: '911', universal: '911', notes: 'Tourist police varies by state' },
  { country: 'Indonesia', code: 'ID', flag: '🇮🇩', police: '110', ambulance: '118', fire: '113', universal: '112', notes: 'Search & rescue: 115' },
  { country: 'Turkey', code: 'TR', flag: '🇹🇷', police: '155', ambulance: '112', fire: '110', universal: '112', notes: 'Gendarmerie: 156' },
  { country: 'Russia', code: 'RU', flag: '🇷🇺', police: '102', ambulance: '103', fire: '101', universal: '112', notes: 'From mobile: 112' },
  { country: 'South Africa', code: 'ZA', flag: '🇿🇦', police: '10111', ambulance: '10177', fire: '10111', universal: '112', notes: 'From mobile: 112' },
  { country: 'Egypt', code: 'EG', flag: '🇪🇬', police: '122', ambulance: '123', fire: '180', universal: '122', notes: 'Tourist police: 126' },
  { country: 'Malaysia', code: 'MY', flag: '🇲🇾', police: '999', ambulance: '999', fire: '994', universal: '999', notes: 'From mobile: 112' },
  { country: 'New Zealand', code: 'NZ', flag: '🇳🇿', police: '111', ambulance: '111', fire: '111', universal: '111', notes: 'Non-emergency: *555' },
  { country: 'Netherlands', code: 'NL', flag: '🇳🇱', police: '112', ambulance: '112', fire: '112', universal: '112', notes: 'Non-emergency police: 0900-8844' },
  { country: 'Switzerland', code: 'CH', flag: '🇨🇭', police: '117', ambulance: '144', fire: '118', universal: '112', notes: 'Poison: 145' },
  { country: 'Portugal', code: 'PT', flag: '🇵🇹', police: '112', ambulance: '112', fire: '112', universal: '112', notes: 'Tourist support: 808 781 212' },
  { country: 'Greece', code: 'GR', flag: '🇬🇷', police: '100', ambulance: '166', fire: '199', universal: '112', notes: 'Tourist police: 171' },
  { country: 'Vietnam', code: 'VN', flag: '🇻🇳', police: '113', ambulance: '115', fire: '114', universal: '113', notes: '' },
  { country: 'Philippines', code: 'PH', flag: '🇵🇭', police: '117', ambulance: '911', fire: '911', universal: '911', notes: 'Red Cross: 143' },
  { country: 'Nepal', code: 'NP', flag: '🇳🇵', police: '100', ambulance: '102', fire: '101', universal: '100', notes: 'Tourist police: 1144' },
  { country: 'Sri Lanka', code: 'LK', flag: '🇱🇰', police: '119', ambulance: '110', fire: '111', universal: '119', notes: 'Accident service: 1990' },
  { country: 'Pakistan', code: 'PK', flag: '🇵🇰', police: '15', ambulance: '115', fire: '16', universal: '15', notes: 'Edhi Foundation: 115' },
  { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', police: '999', ambulance: '999', fire: '199', universal: '999', notes: 'National emergency: 999' },
  { country: 'Maldives', code: 'MV', flag: '🇲🇻', police: '119', ambulance: '102', fire: '118', universal: '119', notes: '' },
  { country: 'Kenya', code: 'KE', flag: '🇰🇪', police: '999', ambulance: '999', fire: '999', universal: '112', notes: '' },
  { country: 'Argentina', code: 'AR', flag: '🇦🇷', police: '101', ambulance: '107', fire: '100', universal: '911', notes: '' },
  { country: 'Colombia', code: 'CO', flag: '🇨🇴', police: '112', ambulance: '125', fire: '119', universal: '123', notes: '' },
  { country: 'Peru', code: 'PE', flag: '🇵🇪', police: '105', ambulance: '117', fire: '116', universal: '105', notes: 'Tourist police: 0800-22221' },
  { country: 'Ireland', code: 'IE', flag: '🇮🇪', police: '999', ambulance: '999', fire: '999', universal: '112', notes: '' },
];

function EmergencyDirectoryPage() {
  const [search, setSearch] = useState('');
  const [expandedCode, setExpandedCode] = useState(null);

  const filtered = emergencyData.filter((c) =>
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Emergency Directory 🌍</h1>
          <p className="page-subtitle">Emergency numbers for countries worldwide</p>
        </div>
      </div>

      {/* Search */}
      <div className="directory-search-container animate-in delay-1">
        <Search size={18} className="directory-search-icon" />
        <input
          id="directory-search"
          className="form-input directory-search-input"
          placeholder="Search by country name (e.g., India, USA, Japan)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Info Banner */}
      <div className="directory-info-banner animate-in delay-2">
        <Globe size={20} />
        <span>
          <strong>112</strong> is the universal emergency number in most countries.
          When in doubt, dial <strong>112</strong> — it works even without a SIM card in many regions.
        </span>
      </div>

      {/* Directory Grid */}
      <div className="directory-grid">
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">
              <Search size={32} />
            </div>
            <h3>No countries found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          filtered.map((c, idx) => (
            <div
              key={c.code}
              className="directory-card animate-in"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="directory-card-header" onClick={() => setExpandedCode(expandedCode === c.code ? null : c.code)}>
                <div className="directory-country">
                  <span className="directory-flag">{c.flag}</span>
                  <div>
                    <div className="directory-country-name">{c.country}</div>
                    <div className="directory-country-code">{c.code}</div>
                  </div>
                </div>
                {expandedCode === c.code ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              <div className="directory-numbers">
                <a href={`tel:${c.police}`} className="directory-number police">
                  <Shield size={14} />
                  <span className="directory-number-label">Police</span>
                  <span className="directory-number-value">{c.police}</span>
                </a>
                <a href={`tel:${c.ambulance}`} className="directory-number ambulance">
                  <Heart size={14} />
                  <span className="directory-number-label">Ambulance</span>
                  <span className="directory-number-value">{c.ambulance}</span>
                </a>
                <a href={`tel:${c.fire}`} className="directory-number fire">
                  <AlertTriangle size={14} />
                  <span className="directory-number-label">Fire</span>
                  <span className="directory-number-value">{c.fire}</span>
                </a>
              </div>

              {expandedCode === c.code && (
                <div className="directory-expanded">
                  <div className="directory-universal">
                    <Phone size={14} />
                    <span>Universal: <strong>{c.universal}</strong></span>
                  </div>
                  {c.notes && (
                    <div className="directory-notes">{c.notes}</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmergencyDirectoryPage;
