export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-4 mt-auto">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          
          <div className="flex items-center space-x-6 text-sm">
            <a 
              href="https://www.aven.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Visit Aven.com
            </a>
            <a 
              href="https://www.aven.com/support" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Support
            </a>
            <a 
              href="https://www.aven.com/education" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              How It Works
            </a>
          </div>
          
          {/* <div className="text-zinc-500 text-xs text-center">
            © 2024 Aven. All rights reserved.
          </div> */}
          

        </div>
      </div>
    </footer>
  );
}; 