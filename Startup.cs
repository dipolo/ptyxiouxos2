using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Ptyxiouxos2.Startup))]
namespace Ptyxiouxos2
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
