'use client'

import React, { useState, useEffect } from 'react';
import {
  Loader,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Zap,
  TrendingUp,
  Award,
} from 'lucide-react';

interface ProspectingData {
  id: number;
  prospect_rank: string;
  prospect_name: string;
  email: string;
  phone: string;
  leader_name: string;
  decision_maker: string;
  key_opportunity: string;
  value_proposition: string;
  estimated_value: string;
  partnership_potential: string;
  location: string;
  status: string;
  quality_score: number;
  market_reach: number;
  engagement_timeline: string;
}

const rankColors: Record<string, { bg: string; text: string; border: string }> = {
  'PRIORITY 1 - VERY HIGH': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  'PRIORITY 2 - HIGH': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  'PRIORITY 3 - HIGH': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  'PRIORITY 4 - MEDIUM-HIGH': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  'PRIORITY 5 - MEDIUM-HIGH': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
};

const estimatedValueColors: Record<string, string> = {
  'Very High': 'text-red-600 font-bold',
  'High': 'text-orange-600 font-semibold',
  'Medium-High': 'text-amber-600 font-semibold',
  'Medium': 'text-yellow-600',
};

interface ProspectingViewProps {
  division: string;
  loading?: boolean;
}

export const ProspectingView: React.FC<ProspectingViewProps> = ({
  division,
  loading = false,
}) => {
  const [prospects, setProspects] = useState<ProspectingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalProspects: 0,
    highPriority: 0,
    totalMarketReach: 0,
    avgQualityScore: 0,
  });

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch prospecting data
        const response = await fetch(`/api/divisions/${division}/prospecting?limit=20`);
        if (!response.ok) throw new Error('Failed to fetch prospecting data');

        const data = await response.json();
        const prospectList = data.data || [];
        setProspects(prospectList);

        // Calculate stats
        if (prospectList.length > 0) {
          const highPriorityCount = prospectList.filter(
            (p: ProspectingData) =>
              p.prospect_rank.includes('PRIORITY 1') || p.prospect_rank.includes('PRIORITY 2') || p.prospect_rank.includes('PRIORITY 3')
          ).length;

          const totalMarketReach = prospectList.reduce(
            (sum: number, p: ProspectingData) => sum + (p.market_reach || 0),
            0
          );

          const avgQuality =
            prospectList.reduce((sum: number, p: ProspectingData) => sum + p.quality_score, 0) /
            prospectList.length;

          setStats({
            totalProspects: prospectList.length,
            highPriority: highPriorityCount,
            totalMarketReach,
            avgQualityScore: Math.round(avgQuality),
          });
        }
      } catch (error) {
        console.error('Error fetching prospecting data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (division) {
      fetchProspects();
    }
  }, [division]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-3" />
          <p className="text-red-700 font-medium">Error loading prospecting data</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Foundation Prospecting Report</h2>
          <p className="text-gray-600 text-sm mt-1">Daily sales & marketing prospecting analysis</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
          Generate New Report
        </button>
      </div>

      {/* Stats Cards */}
      {prospects.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Prospects</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProspects}</p>
              </div>
              <Award size={32} className="text-indigo-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">High Priority</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.highPriority}</p>
              </div>
              <Zap size={32} className="text-red-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Market Reach</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.totalMarketReach}+</p>
              </div>
              <TrendingUp size={32} className="text-amber-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Quality Score</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.avgQualityScore}/100</p>
              </div>
              <Award size={32} className="text-green-600 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Prospects List */}
      {prospects.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <AlertCircle size={40} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No prospecting data available for this division.</p>
          <p className="text-gray-400 text-sm mt-2">Generate your first prospecting report to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prospects.map((prospect) => {
            const rankColor = rankColors[prospect.prospect_rank] || rankColors['PRIORITY 5 - MEDIUM-HIGH'];
            const valueColor = estimatedValueColors[prospect.estimated_value] || 'text-gray-600';

            return (
              <div
                key={prospect.id}
                className={`rounded-lg border-2 p-6 transition-all hover:shadow-lg ${rankColor.bg} ${rankColor.border}`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-bold ${rankColor.text}`}>{prospect.prospect_name}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${rankColor.bg} ${rankColor.text} border ${rankColor.border}`}>
                        {prospect.prospect_rank}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{prospect.key_opportunity}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${valueColor}`}>{prospect.estimated_value}</p>
                    <p className="text-xs text-gray-500 mt-1">Value: {prospect.partnership_potential}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {/* Decision Maker */}
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Decision Maker</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{prospect.decision_maker}</p>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Location</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={14} className="text-gray-500" />
                      <p className="text-sm font-medium text-gray-900">{prospect.location}</p>
                    </div>
                  </div>

                  {/* Market Reach */}
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Market Reach</p>
                    <p className="text-sm font-bold text-amber-600 mt-1">{prospect.market_reach}+ Schools</p>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Timeline</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{prospect.engagement_timeline}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex gap-4 pt-4 border-t border-gray-300 border-opacity-50">
                  {prospect.email && (
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                      <Mail size={16} />
                      <span>{prospect.email}</span>
                    </button>
                  )}
                  {prospect.phone && (
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                      <Phone size={16} />
                      <span>{prospect.phone}</span>
                    </button>
                  )}
                  <button className="ml-auto px-3 py-1 text-xs font-medium text-indigo-600 bg-white border border-indigo-600 rounded hover:bg-indigo-50">
                    Contact
                  </button>
                </div>

                {/* Status */}
                <div className="mt-3 pt-3 border-t border-gray-300 border-opacity-50">
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                    prospect.status === 'Ready for Outreach'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {prospect.status}
                  </span>
                  <span className="text-xs text-gray-500 ml-3">Quality: {prospect.quality_score}/100</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProspectingView;
