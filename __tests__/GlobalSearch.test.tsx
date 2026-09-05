import { render, screen, fireEvent, act } from '@testing-library/react';
import GlobalSearch from '@/components/layout/GlobalSearch';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ 
      success: true, 
      data: { temples: [], festivals: [], pilgrimages: [], regions: [] } 
    }),
  })
) as jest.Mock;

describe('GlobalSearch Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the search input', () => {
    render(<GlobalSearch />);
    const input = screen.getByPlaceholderText('Search temples, regions...');
    expect(input).toBeInTheDocument();
  });

  it('updates input value on type', () => {
    render(<GlobalSearch />);
    const input = screen.getByPlaceholderText('Search temples, regions...');
    
    fireEvent.change(input, { target: { value: 'Shiva' } });
    
    expect(input).toHaveValue('Shiva');
  });

  it('opens the dropdown after typing and debouncing', async () => {
    jest.useFakeTimers();
    render(<GlobalSearch />);
    const input = screen.getByPlaceholderText('Search temples, regions...');
    
    fireEvent.change(input, { target: { value: 'Shiva' } });
    
    // Fast-forward debounce timer (300ms) inside act
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Check if the dropdown UI element appears (it should show No results found since mock data is empty)
    expect(await screen.findByText(/No results found/i)).toBeInTheDocument();
    
    jest.useRealTimers();
  });
});
