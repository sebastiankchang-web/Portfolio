import { TabType } from "@/lib/types";

type TabNavigationProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex border-b">
      <button 
        className={`tab-button flex-1 py-4 px-4 text-center font-heading font-medium ${activeTab === 'activity-feed' ? 'active' : ''}`}
        onClick={() => setActiveTab('activity-feed')}
      >
        Activity Feed
      </button>
      <button 
        className={`tab-button flex-1 py-4 px-4 text-center font-heading font-medium ${activeTab === 'my-trips' ? 'active' : ''}`}
        onClick={() => setActiveTab('my-trips')}
      >
        My Trips
      </button>
      <button 
        className={`tab-button flex-1 py-4 px-4 text-center font-heading font-medium ${activeTab === 'bookings' ? 'active' : ''}`}
        onClick={() => setActiveTab('bookings')}
      >
        Bookings
      </button>
    </div>
  );
}
