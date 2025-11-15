const Loading = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-8">
      {/* Animated gradient bars */}
      <div className="flex items-end gap-2 h-16">
        <div 
          className="w-3 rounded-t-full ignielPelangi"
          style={{ 
            height: '40%',
            animation: 'loadingBar 1.2s ease-in-out infinite',
            animationDelay: '0s'
          }}
        ></div>
        <div 
          className="w-3 rounded-t-full ignielPelangi"
          style={{ 
            height: '60%',
            animation: 'loadingBar 1.2s ease-in-out infinite',
            animationDelay: '0.15s'
          }}
        ></div>
        <div 
          className="w-3 rounded-t-full ignielPelangi"
          style={{ 
            height: '80%',
            animation: 'loadingBar 1.2s ease-in-out infinite',
            animationDelay: '0.3s'
          }}
        ></div>
        <div 
          className="w-3 rounded-t-full ignielPelangi"
          style={{ 
            height: '100%',
            animation: 'loadingBar 1.2s ease-in-out infinite',
            animationDelay: '0.45s'
          }}
        ></div>
        <div 
          className="w-3 rounded-t-full ignielPelangi"
          style={{ 
            height: '80%',
            animation: 'loadingBar 1.2s ease-in-out infinite',
            animationDelay: '0.6s'
          }}
        ></div>
        <div 
          className="w-3 rounded-t-full ignielPelangi"
          style={{ 
            height: '60%',
            animation: 'loadingBar 1.2s ease-in-out infinite',
            animationDelay: '0.75s'
          }}
        ></div>
        <div 
          className="w-3 rounded-t-full ignielPelangi"
          style={{ 
            height: '40%',
            animation: 'loadingBar 1.2s ease-in-out infinite',
            animationDelay: '0.9s'
          }}
        ></div>
      </div>
      
      {/* Loading text with gradient */}
      <div className="flex flex-col items-center gap-3">
        <p className="font-montserrat text-default text-xl font-bold ignielTextGradient tracking-wide">
          Loading ...
        </p>
        {/* Animated gradient line */}
        <div className="relative w-32 h-1 bg-[#121212] rounded-full overflow-hidden">
          <div 
            className="absolute h-full ignielPelangi rounded-full"
            style={{
              width: '30%',
              animation: 'loadingProgress 1.5s ease-in-out infinite'
            }}
          ></div>
        </div>
      </div>

    </div>
  );
};

export default Loading;

